from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional

from database import get_db
from models import Post, Comment, User, PostCategory as PostCategoryEnum
from schemas import PostCreate, PostOut, CommentCreate, CommentOut

router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.get("", response_model=List[PostOut])
async def list_posts(
    category: Optional[str] = None,
    society_name: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Post).order_by(Post.created_at.desc())
    if category and category != "All":
        query = query.where(Post.category == category)
    if society_name:
        query = query.where(Post.society_name == society_name)
    result = await db.execute(query)
    posts = result.scalars().all()

    output = []
    for post in posts:
        # count comments
        cnt_result = await db.execute(
            select(func.count(Comment.id)).where(Comment.post_id == post.id)
        )
        comment_count = cnt_result.scalar() or 0

        author_name = None
        if post.user_id:
            user_result = await db.execute(select(User).where(User.id == post.user_id))
            user = user_result.scalar_one_or_none()
            if user:
                author_name = user.name

        post_dict = {
            "id": post.id,
            "society_name": post.society_name,
            "category": post.category,
            "title": post.title,
            "description": post.description,
            "upvotes": post.upvotes,
            "created_at": post.created_at,
            "user_id": post.user_id,
            "author_name": author_name,
            "comment_count": comment_count,
        }
        output.append(PostOut(**post_dict))
    return output


@router.post("", response_model=PostOut)
async def create_post(data: PostCreate, db: AsyncSession = Depends(get_db)):
    post = Post(
        society_name=data.society_name,
        category=data.category,
        title=data.title,
        description=data.description,
    )
    db.add(post)
    await db.flush()
    await db.refresh(post)
    post_dict = {
        "id": post.id,
        "society_name": post.society_name,
        "category": post.category,
        "title": post.title,
        "description": post.description,
        "upvotes": post.upvotes,
        "created_at": post.created_at,
        "user_id": post.user_id,
        "author_name": None,
        "comment_count": 0,
    }
    return PostOut(**post_dict)


@router.post("/{post_id}/upvote")
async def upvote_post(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.upvotes += 1
    db.add(post)
    await db.flush()
    return {"upvotes": post.upvotes}


@router.get("/{post_id}/comments", response_model=List[CommentOut])
async def list_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at.asc())
    )
    comments = result.scalars().all()
    output = []
    for c in comments:
        author_name = None
        if c.user_id:
            ur = await db.execute(select(User).where(User.id == c.user_id))
            u = ur.scalar_one_or_none()
            if u:
                author_name = u.name
        output.append(CommentOut(
            id=c.id, body=c.body, created_at=c.created_at,
            user_id=c.user_id, author_name=author_name
        ))
    return output


@router.post("/{post_id}/comments", response_model=CommentOut)
async def add_comment(post_id: int, data: CommentCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == post_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Post not found")
    comment = Comment(post_id=post_id, body=data.body)
    db.add(comment)
    await db.flush()
    await db.refresh(comment)
    return CommentOut(id=comment.id, body=comment.body, created_at=comment.created_at, user_id=None, author_name=None)
