const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // @TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    return item;
  },
  updateItem(parent, args, ctx, info) {
    // fist take a copy of the updates
    const updates = { ...args };
    // remove the id from the updates ( you can't update it anyway )
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info);
  },
  async deleteItem(parent, args, ctx, info) {
    // Make a where variable
    const where = { id: args.id };
    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{ id, title }`);
    // 2. Check if they own the item, or have the permissions
    // @TODO: Permissions checks

    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    /**
      * lowercase email for easier sign in later
      * If they signed up with the upper case version, they
      * may forget on signin and run into issues
    */
    args.email = args.email.toLowerCase();

    // hash their password for storage
    const password = await bcrypt.hash(args.password, 10);

    // create user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );

    // Create JWT token for them, use your env secrets!
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // Set the jwt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true, // prevent client-side tampering
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    // Finally return the user to the browser
    return user;
  },
  async signin(parent, {email, password}, ctx, info) {
    // 1. Check if there is a user with that email
    const user = await ctx.db.query.user({where: { email }});

    if(!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // 2. Check if password correct
    const valid = await bcrypt.compare(password, user.password);
    if(!valid) {
      throw new Error(`Invlid password!`);
    }

    // 3. Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // 4. Set cookie with token
    ctx.response.cookie('token', token, {
      httpOnly: true, // prevent client-side tampering
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });

    // 5. Return the user
    return user;
  }
};

module.exports = Mutations;
