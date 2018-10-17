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
  }
};

module.exports = Mutations;
