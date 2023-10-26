export type BlogPost = {
	id: string
	title: string
	slug: string
	url: string
	coverImageUrl: string
	brief: string
	readTimeInMinutes: number
	publishedAt: string
}

export function getBlogMdContent(blogs: BlogPost[]): string {
	const blogsMd = `
<h3 align="center">📝 Latest Blog Posts:</h3>
<table style="table-layout: fixed;">
<tr width="100%">
${blogs.map(blog => getFormattedBlogMarkdown(blog)).join('')}
</tr>
</table>
<p align="right">
<kbd >
<a href="https://blog.sarthakjdev.com/">Read more blogs</a>
</kbd>
</p>
`
	return blogsMd
}


export function getFormattedBlogMarkdown(blog: BlogPost) {
	const blogCard = `

<th style="width: 33.33%; border: 1px solid #dcdcdc;">
    <p align="center">
        <img src="${blog.coverImageUrl}" alt="${blog.url.split('/').at(-1)}-alt" width="300">
    </p>
    <p align="center">
        <strong>${blog.title.slice(0, 50)}...</strong><br>
        Published on: ${blog.publishedAt}
    </p>
    <p align="center">
📖      <a href="${blog.url}">Read the full article</a>
    </p>
</th>
`
	return blogCard
}



export const fetchLatestBlogs = async (count: number) => {
	const query = {
		query: `query { publication(host: "blog.sarthakjdev.com"){  posts(first: ${count}){edges{node {
	id       
	title      
	slug   
	url   
	brief 
	coverImage {         
		url        
	}               
	readTimeInMinutes 
	publishedAt
}}}}}`
	}

	const blogs = await fetch('https://gql.hashnode.com/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(query),
		cache: 'force-cache'
	}).then(res => res.json())

	return blogs.data.publication.posts.edges.map((item: any) => {
		const post = item.node

		return {
			id: post.id,
			title: post.title,
			slug: post.slug,
			url: post.url,
			coverImageUrl: post.coverImage.url,
			brief: post.brief,
			publishedAt: formatDate(post.publishedAt),
			readTimeInMinutes: post.readTimeInMinutes
		}
	}) as BlogPost[]
}


function formatDate(date: string) {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	const dateObj = new Date(date);
	return dateObj.toLocaleDateString('en-US', options);
};


