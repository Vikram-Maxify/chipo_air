const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel");

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

        if (!email) {
          return done(null, false);
        }

        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        user = await User.create({
          firstname: profile.name?.givenName,
          lastname: profile.name?.familyName,
          email,
          verified: true,
          password: null,
          points: 500,
        });

        return done(null, user);
      } catch (err) {
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
      profileFields: ["id", "emails", "name"], // 👈 important
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        // ⚠️ Facebook kabhi email nahi deta
        if (!email) {
          return done(null, false, {
            message: "Facebook email not available",
          });
        }

        let user = await User.findOne({ email });

        if (user) {
          return done(null, user);
        }

        user = await User.create({
          firstname: profile.name?.givenName,
          lastname: profile.name?.familyName,
          email,
          verified: true,
          password: null,
          points: 500,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ================= SESSION (optional) =================
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;