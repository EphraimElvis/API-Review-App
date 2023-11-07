const { error } = require("console");
const Sauce = require("../models/sauce");
const fs = require("fs");
const { parse } = require("querystring");
const sauce = require("../models/sauce");

exports.createSauce = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const sauceData = req.body;

  Sauce.create({
    userId: req.userId,
    ...sauceData,
    imageUrl: url + "/images/" + req.file.filename,
  })

    .then((sauce) => {
      res.status(201).json({
        message: "Sauce created and saved successfully!",
        _id: sauce._id,
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
    const url = req.protocol + "://" + req.get("host");
    sauceData.imageUrl = url + "/images/" + req.file.filename;
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
      if (!sauce) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json(error);
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
            message: "Successfully cancelled like",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    });
  } else {
    let likeMessage = "Sucessfully liked sauce";
    let likeData = {
      $inc: { likes: 1 },
      $push: { usersLiked: userId },
    };

    if (like === -1) {
      likeMessage = "Successfully  dislike";
      likeData = {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId },
      };
    }

    Sauce.updateOne({ _id: req.params.id }, likeData)
      .then(() => {
        res.status(200).json({
          message: likeMessage,
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
};
