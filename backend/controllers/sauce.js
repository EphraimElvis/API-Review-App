const { error } = require("console");
const Sauce = require("../models/sauce");
const fs = require("fs");
const { parse } = require("querystring");

exports.createSauce = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const sauceData = JSON.parse(req.body.sauce);

  // const sauce = new Sauce({
  //   userId: sauceData.userId,
  //   name: sauceData.name,
  //   manufacturer: sauceData.manufacturer,
  //   description: sauceData.description,
  //   mainPepper: sauceData.mainPepper,
  //   imageUrl: url + "/images/" + req.file.filename,
  //   heat: sauceData.heat,
  // });
  // sauce.userId = "123";
  // console.log(sauce);
  // const sauce = new Sauce({
  //   ...req.body.sauce,
  //   imageUrl: url + "/images/" + req.file.filename,
  // });
  Sauce.create({
    ...sauceData,
    imageUrl: url + "/images/" + req.file.filename,
  })

    .then(() => {
      res.status(201).json({
        message: "Sauce created and saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "unable to create sauce",
        error: error,
      });
      console.log(error);
    });
};

exports.getAllSauce = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((erorr) => {
      res.status(400).json({
        erorr,
      });
    });
};

exports.modifySauce = (req, res) => {
  const _id = req.params.id;
  const sauceData = req.body;

  if (req.file) {
    sauceData.imageUrl = req.protocol + "/images/" + req.file.filename;
  }

  Sauce.findByIdAndUpdate({ _id }, sauceData)
    .then((sauce) => {
      if (sauce) {
        res.status(201).json({
          message: "Thing updated successfully!",
        });
      } else {
        console.log("not found");
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(401).json({
        error: error,
      });
    });
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Successfully Deleted ",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

exports.likeSauce = (req, res) => {
  const userId = req.body.userId;
  const like = req.body.like;
  if (like === 0) {
    Sauce.findById({ _id: req.params.id }).then((sauce) => {
      let likedData = {
        $inc: { likes: -1 },
        $pull: { usersLiked: userId },
      };

      if (sauce.usersDisliked.includes(userId)) {
        likedData = {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: userId },
        };
      }

      Sauce.updateOne({ _id: req.params.id }, likedData)
        .then(() => {
          res.status(200).json({
            message: "Successfully Deleted ",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    });
  } else {
    let likeData = {
      $inc: { likes: 1 },
      $push: { usersLiked: userId },
    };

    if (like === -1) {
      likeData = {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId },
      };
    }

    Sauce.updateOne({ _id: req.params.id }, likeData)
      .then(() => {
        res.status(200).json({
          message: "Successfully Deleted ",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  }
};
