const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// ================= GOOGLE =================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const picture = profile.photos?.[0]?.value || "";

        if (!email) return done(null, false);

        let user = await User.findOne({ email });

        // ================= CREATE USER =================
        if (!user) {
          user = new User({
            firstname: profile.name?.givenName || "",
            lastname: profile.name?.familyName || "",
            email,
            image: picture,
            verified: true,
            password: null,
            points: 500,
          });

          await user.save();
        }

        // ================= UPDATE USER =================
        else {
          user.firstname = user.firstname || profile.name?.givenName || "";
          user.lastname = user.lastname || profile.name?.familyName || "";
          user.image = user.image || picture;
          user.verified = true;

          await user.save();
        }

        // ================= TOKEN =================
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // ================= RESPONSE =================
        return done(null, {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          image: user.image,
          points: user.points,
          role: user.role,
          token,
        });

      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);

// ================= FACEBOOK =================
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const picture = profile.photos?.[0]?.value || "";

        if (!email) {
          return done(null, false, {
            message: "Facebook email not available",
          });
        }

        let user = await User.findOne({ email });

        // ================= CREATE USER =================
        if (!user) {
          user = new User({
            firstname: profile.name?.givenName || "",
            lastname: profile.name?.familyName || "",
            email,
            image: picture,
            verified: true,
            password: null,
            points: 500,
          });

          await user.save();
        }

        // ================= UPDATE USER =================
        else {
          user.firstname = user.firstname || profile.name?.givenName || "";
          user.lastname = user.lastname || profile.name?.familyName || "";
          user.image = user.image || picture;
          user.verified = true;

          await user.save();
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          image: user.image,
          points: user.points,
          role: user.role,
          token,
        });

      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);

// ================= SESSION =================
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;