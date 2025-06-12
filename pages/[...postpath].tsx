import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';
import styles from '../styles/Post.module.css';

// Declare missing types
declare module 'next/head';
declare module 'graphql-request';

interface PostNode {
	id: string;
	excerpt: string;
	title: string;
	link: string;
	dateGmt: string;
	modifiedGmt: string;
	content: string;
	author: {
		node: {
			name: string;
		};
	};
	featuredImage: {
		node: {
			sourceUrl: string;
			altText: string;
		};
	};
}

interface GraphQLResponse {
	post: PostNode;
}

interface ServerSideContext {
	req: {
		headers: {
			referer?: string;
			host?: string;
		};
	};
	query: {
		postpath: string[];
		fbclid?: string;
	};
}

export const getServerSideProps: GetServerSideProps = async (ctx: ServerSideContext) => {
	try {
		const endpoint = "https://cindl.top/graphql"
		const graphQLClient = new GraphQLClient(endpoint);
		const referringURL = ctx.req.headers?.referer || null;
		const pathArr = ctx.query.postpath;
		const path = pathArr.join('/');
		const fbclid = ctx.query.fbclid;

		// redirect if facebook is the referer or request contains fbclid
		if (referringURL?.includes('facebook.com') || fbclid) {
			return {
				redirect: {
					permanent: false,
					destination: `${
						`https://alcashzone.com/` + encodeURI(path)
					}`,
				},
			};
		}

		const query = gql`
			query GetPost($path: ID!) {
				post(id: $path, idType: URI) {
					id
					excerpt
					title
					link
					dateGmt
					modifiedGmt
					content
					author {
						node {
							name
						}
					}
					featuredImage {
						node {
							sourceUrl
							altText
						}
					}
				}
			}
		`;

		const variables = {
			path: `/${path}/`,
		};

		const data = await graphQLClient.request<GraphQLResponse>(query, variables);

		if (!data.post) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				path,
				post: data.post,
				host: ctx.req.headers.host || 'alcashzone.com',
			},
		};
	} catch (error) {
		console.error('Error fetching post:', error);
		return {
			notFound: true,
		};
	}
};

interface PostProps {
	post: PostNode;
	host: string;
	path: string;
}

const Post: React.FC<PostProps> = (props: PostProps) => {
	const { post, host, path } = props;

	// to remove tags from excerpt
	const removeTags = (str: string) => {
		if (str === null || str === '') return '';
		return str.toString().replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
	};

	const sanitizedContent = React.useMemo(() => {
		// Basic XSS protection by removing script tags
		return post.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
	}, [post.content]);

	return (
		<div className={styles['post-wrapper']}>
			<Head>
				<title>{post.title}</title>
				<meta name="description" content={removeTags(post.excerpt)} />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={removeTags(post.excerpt)} />
				<meta property="og:type" content="article" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:site_name" content={host.split('.')[0]} />
				<meta property="article:published_time" content={post.dateGmt} />
				<meta property="article:modified_time" content={post.modifiedGmt} />
				<meta property="og:image" content={post.featuredImage.node.sourceUrl} />
				<meta
					property="og:image:alt"
					content={post.featuredImage.node.altText || post.title}
				/>
				<link rel="canonical" href={`https://${host}/${path}`} />
			</Head>
			<div className={styles['post-container']}>
				<h1 className={styles['post-title']}>{post.title}</h1>
				<div className={styles['post-meta']}>
					<time dateTime={post.dateGmt}>
						{new Date(post.dateGmt).toLocaleDateString()}
					</time>
					<span className={styles['post-author']}> by {post.author.node.name}</span>
				</div>
				{post.featuredImage && (
					<div className={styles['post-image']}>
						<img
							src={post.featuredImage.node.sourceUrl}
							alt={post.featuredImage.node.altText || post.title}
							loading="lazy"
						/>
					</div>
				)}
				<article 
					className={styles['post-content']}
					dangerouslySetInnerHTML={{ __html: sanitizedContent }}
				/>
			</div>
		</div>
	);
};

export default Post;
