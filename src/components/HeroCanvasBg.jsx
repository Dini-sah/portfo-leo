import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;

uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;

  float r1 = smoothstep(0.0 + 0.35 * edgesWidth, 0.7 - 0.35 * edgesWidth + 0.5 * edge_blur, mixer);
  float r2 = smoothstep(0.3 + 0.35 * edgesWidth, 1.0 - 0.35 * edgesWidth + edge_blur, mixer);

  vec3 blended_color_2 = mix(color1, color2, r1);
  float blended_opacity_2 = mix(c1.a, c2.a, r1);

  vec3 c = mix(blended_color_2, color3, r2);
  float o = mix(blended_opacity_2, c3.a, r2);
  return vec4(c, o);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float t = 0.5 * u_time;
  float noise_scale = 0.0005 + 0.006 * u_scale;

  uv -= 0.5;
  uv *= (noise_scale * u_resolution);
  uv = rotate(uv, u_rotation * 0.5 * PI);
  uv /= u_pixelRatio;
  uv += 0.5;

  float n1 = noise(uv * 1.0 + t);
  float n2 = noise(uv * 2.0 - t);
  float angle = n1 * TWO_PI;
  uv.x += 4.0 * u_distortion * n2 * cos(angle);
  uv.y += 4.0 * u_distortion * n2 * sin(angle);

  float iterations_number = ceil(clamp(u_swirlIterations, 1.0, 30.0));
  for (float i = 1.0; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0.0, 2.0) / i * cos(t + i * 1.0 * uv.x);
  }

  float proportion = clamp(u_proportion, 0.0, 1.0);

  float shape = 0.0;
  float mixer = 0.0;
  if (u_shape < 0.5) {
    vec2 checks_shape_uv = uv * (0.5 + 3.5 * u_shapeScale);
    shape = 0.5 + 0.5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);
  } else if (u_shape < 1.5) {
    vec2 stripes_shape_uv = uv * (0.25 + 3.0 * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(0.0, 0.55, f) * smoothstep(1.0, 0.45, f);
    mixer = shape + 0.48 * sign(proportion - 0.5) * pow(abs(proportion - 0.5), 0.5);
  } else {
    float sh = 1.0 - uv.y;
    sh -= 0.5;
    sh /= (noise_scale * u_resolution.y);
    sh += 0.5;
    float shape_scaling = 0.2 * (1.0 - u_shapeScale);
    shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (proportion - 0.5));
    mixer = shape;
  }

  vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1.0 - clamp(u_softness, 0.0, 1.0), 0.01 + 0.01 * u_scale);

  fragColor = vec4(color_mix.rgb, color_mix.a);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  return { program, vs, fs };
}

/**
 * HeroCanvasBg
 * Renders the moving 3D violet silk wave object animation inspired by Diya Gupta's portfolio (diyagupta.framer.website).
 * Hardware-accelerated WebGL2 Prism shader with visible, undulating 3D silk motion.
 * Transparent canvas that smoothly fades to white as user scrolls into the About section.
 */
export default function HeroCanvasBg() {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();

  // Seamlessly fade the canvas opacity to 0 as user scrolls towards the white About section
  const canvasOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = null;
    try {
      gl = canvas.getContext('webgl2', {
        alpha: true,
        depth: false,
        antialias: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance'
      });
    } catch {
      gl = null;
    }

    // High-performance 2D Silk Torus fallback if WebGL2 is unsupported
    if (!gl) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let rafId;
      let t = 0;

      const render2d = () => {
        t += 0.008;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        // 3D Moving Silk Ribbon Wave Object (Rich violet with low blue)
        ctx.save();
        ctx.beginPath();
        const sway = Math.sin(t) * 25;
        ctx.ellipse(w * 0.12 + sway, h * 0.5, w * 0.18, h * 0.48, Math.PI * 0.08, 0, Math.PI * 2);
        ctx.lineWidth = Math.min(w * 0.08, 90);
        const ribbonGrad = ctx.createLinearGradient(0, h * 0.1, w * 0.25, h * 0.9);
        ribbonGrad.addColorStop(0, 'rgba(110, 25, 150, 0.20)');
        ribbonGrad.addColorStop(0.3, 'rgba(160, 52, 185, 0.70)');
        ribbonGrad.addColorStop(0.6, 'rgba(125, 32, 155, 0.75)');
        ribbonGrad.addColorStop(1, 'rgba(75, 18, 110, 0.20)');
        ctx.strokeStyle = ribbonGrad;
        ctx.filter = 'blur(28px)';
        ctx.stroke();
        ctx.restore();

        // Secondary glowing core
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(w * 0.13 + sway * 0.7, h * 0.52, w * 0.13, h * 0.42, Math.PI * 0.08, 0, Math.PI * 2);
        ctx.lineWidth = Math.min(w * 0.04, 45);
        const coreGrad = ctx.createLinearGradient(0, h * 0.2, w * 0.18, h * 0.8);
        coreGrad.addColorStop(0, 'rgba(160, 52, 185, 0)');
        coreGrad.addColorStop(0.4, 'rgba(180, 68, 200, 0.65)');
        coreGrad.addColorStop(0.7, 'rgba(135, 35, 165, 0.70)');
        coreGrad.addColorStop(1, 'rgba(90, 20, 125, 0)');
        ctx.strokeStyle = coreGrad;
        ctx.filter = 'blur(16px)';
        ctx.stroke();
        ctx.restore();

        rafId = requestAnimationFrame(render2d);
      };

      render2d();
      return () => cancelAnimationFrame(rafId);
    }

    // WebGL2 Prism Pipeline
    let programObj;
    try {
      programObj = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    } catch (err) {
      console.warn('Failed to compile Hero WebGL2 shader:', err);
      return;
    }

    const { program, vs, fs } = programObj;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_pixelRatio: gl.getUniformLocation(program, 'u_pixelRatio'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_scale: gl.getUniformLocation(program, 'u_scale'),
      u_rotation: gl.getUniformLocation(program, 'u_rotation'),
      u_color1: gl.getUniformLocation(program, 'u_color1'),
      u_color2: gl.getUniformLocation(program, 'u_color2'),
      u_color3: gl.getUniformLocation(program, 'u_color3'),
      u_proportion: gl.getUniformLocation(program, 'u_proportion'),
      u_softness: gl.getUniformLocation(program, 'u_softness'),
      u_shape: gl.getUniformLocation(program, 'u_shape'),
      u_shapeScale: gl.getUniformLocation(program, 'u_shapeScale'),
      u_distortion: gl.getUniformLocation(program, 'u_distortion'),
      u_swirl: gl.getUniformLocation(program, 'u_swirl'),
      u_swirlIterations: gl.getUniformLocation(program, 'u_swirlIterations'),
    };

    let rafId = null;
    let lastFrameTime = performance.now();
    let totalAnimationTime = 0;
    let resolutionChanged = true;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        resolutionChanged = true;
        gl.viewport(0, 0, w, h);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);
    handleResize();

    const render = (now) => {
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      // Paced for visible, continuous moving 3D silk waves (fluid undulating motion)
      totalAnimationTime += delta * 0.42;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform1f(uniforms.u_time, totalAnimationTime * 0.001);

      if (resolutionChanged) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.u_pixelRatio, dpr);
        resolutionChanged = false;
      }

      // Exact parameters extracted from diyagupta.framer.website for visible moving 3D silk object
      gl.uniform1f(uniforms.u_scale, 1.0);
      gl.uniform1f(uniforms.u_rotation, 0.0);
      gl.uniform4f(uniforms.u_color1, 0.0, 0.0, 0.0, 0.0);
      gl.uniform4f(uniforms.u_color2, 160 / 255, 48 / 255, 185 / 255, 1.0); // Rich royal violet with low blue
      gl.uniform4f(uniforms.u_color3, 0.0, 0.0, 0.0, 0.0);
      gl.uniform1f(uniforms.u_proportion, 0.30); // Balanced proportion to reduce over-extended blue haze
      gl.uniform1f(uniforms.u_softness, 0.88); // Crisp silk folds so the moving object is distinctly visible
      gl.uniform1f(uniforms.u_shape, 0.0);     // Checks
      gl.uniform1f(uniforms.u_shapeScale, 0.10);
      gl.uniform1f(uniforms.u_distortion, 0.24);
      gl.uniform1f(uniforms.u_swirl, 0.80);
      gl.uniform1f(uniforms.u_swirlIterations, 10.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (gl) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity: canvasOpacity }}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
