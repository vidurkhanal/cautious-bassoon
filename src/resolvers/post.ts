import { Post } from "../entities/Post";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const postToUpdate = await em.findOne(Post, { id });
    if (!postToUpdate) {
      return null;
    }
    if (typeof title !== "undefined") {
      postToUpdate.title = title;
      await em.persistAndFlush(postToUpdate);
    }
    return postToUpdate;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
