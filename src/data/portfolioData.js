import portfolioConfig from './portfolioConfig.json';

// Root raw configuration export
export const PORTFOLIO_CONFIG = portfolioConfig;

// Backward-compatible unified PORTFOLIO_INFO
export const PORTFOLIO_INFO = {
  ...portfolioConfig.personal,
  introStatementTitle: portfolioConfig.about?.tagline || "Hey, I'm Ralph",
  introStatementBody: portfolioConfig.about?.statement || "",
  outOfOfficeTitle: portfolioConfig.outOfOffice?.tagline || "Out of Office",
  outOfOfficeSubtitle: portfolioConfig.outOfOffice?.narrative || "",
  whyDesignQuestion: portfolioConfig.outOfOffice?.whyDesignQuestion || "Why design? My answer is simple.",
  whyDesignAnswer: portfolioConfig.outOfOffice?.whyDesignAnswer || "",
};

// Section-specific exported configs
export const METADATA = portfolioConfig.metadata;
export const NAVBAR_DATA = portfolioConfig.navigation;
export const ABOUT_DATA = portfolioConfig.about;
export const CUBE_IMAGES = portfolioConfig.cubeImages;
export const CLIENTS_DATA = portfolioConfig.clients;
export const CLIENT_LOGOS = portfolioConfig.clients?.logos || [];
export const FEATURED_PROJECTS = portfolioConfig.featuredProjects || [];
export const ARCHIVE_DATA = portfolioConfig.archive;
export const ARCHIVE_PROJECTS = portfolioConfig.archive?.projects || [];
export const OUT_OF_OFFICE_DATA = portfolioConfig.outOfOffice;
export const OUT_OF_OFFICE_PHOTOS = portfolioConfig.outOfOffice?.photos || [];
export const RESUME_DATA = portfolioConfig.resume;
export const FOOTER_DATA = portfolioConfig.footer;
export const SHOWREEL_DATA = portfolioConfig.showreelModal;

export default portfolioConfig;
