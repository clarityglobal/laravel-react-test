import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Clock, Edit, Eye, MessageCircle, Plus, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

interface Post {
    id: number;
    name: string;
    content: string;
    category?: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    comments: Array<{
        id: number;
        content: string;
        user: {
            id: number;
            name: string;
        };
    }>;
}

interface PostsPageProps {
    posts: {
        data: Post[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function PostsIndex({ posts }: PostsPageProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
                        <p className="text-muted-foreground">Manage and view all blog posts</p>
                    </div>
                    <Link href="/posts/create">
                        <Button>
                            <Plus className="h-4 w-4" />
                            Create Post
                        </Button>
                    </Link>
                </div>

                {posts.data.length === 0 ? (
                    <Card className="py-12 text-center">
                        <CardContent>
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                                    <Plus className="text-muted-foreground h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">No posts yet</h3>
                                    <p className="text-muted-foreground text-sm">Create your first blog post to get started.</p>
                                </div>
                                <Link href="/posts/create">
                                    <Button>Create Post</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <Card className="overflow-hidden">
                            <Table className="table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-2/5">Title</TableHead>
                                        <TableHead className="w-1/6">Category</TableHead>
                                        <TableHead className="w-1/6">Author</TableHead>
                                        <TableHead className="w-1/6">Created</TableHead>
                                        <TableHead className="w-1/12">Comments</TableHead>
                                        <TableHead className="w-1/12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.data.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="whitespace-normal">
                                                <div>
                                                    <Link
                                                        href={`/posts/${post.id}`}
                                                        className="hover:text-primary block truncate font-medium transition-colors"
                                                        title={post.name}
                                                    >
                                                        {post.name}
                                                    </Link>
                                                    <p className="text-muted-foreground mt-1 truncate text-sm">
                                                        {post.content.substring(0, 80)}
                                                        {post.content.length > 80 && '...'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{post.category || 'Uncategorized'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate" title={post.user.name}>
                                                        {post.user.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate text-sm">{formatDate(post.created_at)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <MessageCircle className="h-3 w-3 flex-shrink-0" />
                                                    <span>{post.comments.length}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Link href={`/posts/${post.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/posts/${post.id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>

                        {/* Pagination */}
                        {posts.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {posts.links.map((link, index) => (
                                    <span key={index}>
                                        {link.url ? (
                                            <Link href={link.url}>
                                                <Button
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </Link>
                                        ) : (
                                            <Button variant="outline" size="sm" disabled dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
