'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Post } from '@/lib/cms/types';
import { PostForm } from '@/components/admin/blog/PostForm';

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`/api/cms/posts/${params.id}`)
      .then((r) => r.json())
      .then(setPost);
  }, [params.id]);

  if (!post) {
    return <div className="text-admin-text-muted">Chargement...</div>;
  }

  return <PostForm post={post} mode="edit" />;
}
