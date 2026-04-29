const staticUrls = {
  banner: "/assets/images/banner.png",
  avatar: "/assets/images/avatar.png",
  bg: "/assets/images/bg.png",
  icon: "/assets/icons/home.png",
};

Page({
  data: {
    bannerUrl: staticUrls.banner,
    avatarUrl: staticUrls.avatar,
    bgUrl: staticUrls.bg,
    iconUrl: staticUrls.icon,
    message: "Asset Replace Demo",
  },
  onLoad() {
    console.log("Banner URL:", staticUrls.banner);
    console.log("Avatar URL:", staticUrls.avatar);
    console.log("Background URL:", staticUrls.bg);
  },
});
