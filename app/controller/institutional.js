import Model from "../database/mongo/models/institutional";
import Institutional from "../utils/institutional";

module.exports = {
  async store(req, res) {
    const { images: imagesBody, id, type } = req.body;
    const files = req.files;
    const institutional = new Institutional(id);
    let response = {};
    switch (type) {
      case "enterpriseBanner":
        // eslint-disable-next-line no-case-declarations
        response = await institutional.saveBanner(type, files[0]);
        return res.status(response.status).json(response.msg);

      case "contactBanner":
        // eslint-disable-next-line no-case-declarations
        response = await institutional.saveBanner(type, files[0]);
        return res.status(response.status).json(response.msg);

      case "newsBanner":
        // eslint-disable-next-line no-case-declarations
        response = await institutional.saveBanner(type, files[0]);
        return res.status(response.status).json(response.msg);

      default:
        return;
    }
  },
  async index(req, res) {
    const { type } = req.params;
    const banners = await Model.find();
    if (banners.length) {
      if (type == "homeBanners") {
        const bannerImages = banners[0][type].map(banner => ({
          pos: banner.pos,
          name: banner.image,
          image: `${process.env.STATIC_FILES_URL}banners/institutional/home/${banner.image}`
        }));
        return res.json(bannerImages);
      }
      console.log(
        banners[0][type]
          ? `${process.env.STATIC_FILES_URL}banners/institutional/${type}/${banners[0][type]}`
          : null
      );

      return res.send(
        banners[0][type]
          ? `${process.env.STATIC_FILES_URL}banners/institutional/${type}/${banners[0][type]}`
          : "null"
      );
    }

    return res.json(banners);
  },
  async delete(req, res) {
    const { type } = req.params;
    const institutional = new Institutional();
    const re = await institutional.deleteBannerFixed(type);

    return res.status(re.status).json(re.msg);
  }
};
