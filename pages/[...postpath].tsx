import * as React from 'react';
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
	post: PostNode | null;
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

		console.log('Debug - Path:', path);
		console.log('Debug - GraphQL Variables:', { path: `/${path}/` });

		// redirect if facebook is the referer or request contains fbclid
		if (referringURL?.includes('facebook.com') || fbclid) {
			console.log('Debug - Redirecting Facebook traffic');
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
					... on Post {
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
			}
		`;

		const variables = {
			path: `/${path}/`,
		};

		try {
			console.log('Debug - Sending GraphQL request');
			const data = await graphQLClient.request<GraphQLResponse>(query, variables);
			console.log('Debug - GraphQL Response:', JSON.stringify(data, null, 2));

			if (!data || !data.post) {
				console.log('Debug - No post found in response');
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
		} catch (graphqlError) {
			console.error('Debug - GraphQL Request Error:', graphqlError);
			if (graphqlError instanceof Error && graphqlError.message.includes('could not be found')) {
				return {
					notFound: true,
				};
			}
			throw graphqlError;
		}
	} catch (error) {
		console.error('Debug - Outer Error:', error);
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

const Post = ({ post, host, path }: PostProps): React.ReactElement => {
	const removeTags = (str: string) => {
		if (str === null || str === '') return '';
		return str.toString().replace(/(<([^>]+)>)/gi, '').replace(/\[[^\]]*\]/, '');
	};

	const sanitizedContent = React.useMemo(() => {
		return post.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
	}, [post.content]);

	return (
		<div className={styles['post-wrapper']}>
			<Head>
				<title key="title">{post.title}</title>
				<meta key="description" name="description" content={removeTags(post.excerpt)} />
				<meta key="og:title" property="og:title" content={post.title} />
				<meta key="og:description" property="og:description" content={removeTags(post.excerpt)} />
				<meta key="og:type" property="og:type" content="article" />
				<meta key="og:locale" property="og:locale" content="en_US" />
				<meta key="og:site_name" property="og:site_name" content={host.split('.')[0]} />
				<meta key="article:published_time" property="article:published_time" content={post.dateGmt} />
				<meta key="article:modified_time" property="article:modified_time" content={post.modifiedGmt} />
				<meta key="og:image" property="og:image" content={post.featuredImage.node.sourceUrl} />
				<meta
					key="og:image:alt"
					property="og:image:alt"
					content={post.featuredImage.node.altText || post.title}
				/>
				<link key="canonical" rel="canonical" href={`https://${host}/${path}`} />
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
