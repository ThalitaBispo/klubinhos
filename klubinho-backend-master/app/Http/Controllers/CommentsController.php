<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comments;

class CommentsController extends Controller
{
    // create a comment
    public function createComment(Request $request)
    {
        $comment = new Comments;
        $comment->user_id = $request->user_id;
        $comment->post_id = $request->post_id;
        $comment->content = $request->content;
        $comment->save();
        return response()->json([
            "message" => "Comment record created"
        ], 201);
    }

    // delete a comment
    public function deleteComment($id)
    {
        if(Comments::where('id', $id)->exists()) {
            $comment = Comments::find($id);
            $comment->delete();

            return response()->json([
                "message" => "Comment deleted"
            ], 202);
        } else {
            return response()->json([
                "message" => "Comment not found"
            ], 404);
        }
    }

    // get all comments by post
    public function getAllCommentsByPost($id)
    {
        if(Comments::where('post_id', $id)->exists()) {
            $comment = Comments::where('post_id', $id)
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->select('comments.*', 'users.name', 'users.last_name', 'users.imagem')
            ->orderBy('comments.updated_at', 'asc')
            ->get();
            return response($comment, 200);
        } else {
            return [];
        }
    }
}
