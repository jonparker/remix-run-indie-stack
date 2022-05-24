import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Post } from "~/models/post.server";
import { deletePost, getPost } from "~/models/post.server";

type LoaderData = { post: Post };

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, `params.slug is required`);
    
    const post = await getPost(params.slug);
    invariant(post, `Post not found: ${params.slug}`);
    
    return json<LoaderData>({ post });
};

export const action: ActionFunction = async ({
    request
}) => {
  await new Promise((res) => setTimeout(res, 1000));
  
  invariant(request.url.split('/').slice(-1)[0], `params.slug is required`);

  await deletePost(request.url.split('/').slice(-1)[0]);

  return redirect("/posts/admin");
};

export default function PostSlug() {
    const { post } = useLoaderData<LoaderData>();
    const transition = useTransition();
    const isDeleting = Boolean(transition.submission);

    return (
        <>
            <main className="mx-auto max-w-4xl">
            <h1 className="my-6 border-b-2 text-center text-3xl">
                {post.title}
            </h1>
            </main>
            <Form method="post">
                <p className="text-right">
                <button
                type="submit"
                className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
                >
                {isDeleting ? "Deleting..." : "Delete Post"}
                </button>
                </p>
            </Form>
        </>
  );
}
