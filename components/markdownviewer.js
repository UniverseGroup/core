import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import rehypeRaw from "rehype-raw";
import Image from "next/image";
export default function Markdownviewer({value}){
    return (
        // eslint-disable-next-line react/no-children-prop
        <ReactMarkdown children={value} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
            code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                    <SyntaxHighlighter
                        language={match[1]}
                        PreTag="div"
                        {...props}
                    >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                )
            },
            blockquote: ({children, ...props}) => (
                <blockquote style={{borderLeft:'0.25em solid #3b434b',borderRadius:'0.2em',padding:'0 1em',color:'#6a737d',margin:'0'}} {...props}>
                    {children}
                </blockquote>
            ),
            a:({href, children, ...props}) => (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{color:'blue'}} {...props}>
                    {children}
                </a>
            ),
            image: ({
                        alt,
                        src,
                        title,
                    }) => (
                <Image
                    alt={alt}
                    src={`/api/imageproxy?url=${encodeURIComponent(src)}`}
                    loading="lazy"/>
            ),
            table: ({children, ...props}) => (
                <table style={{borderCollapse:'collapse',borderSpacing:'0',width:'20%'}} {...props}>
                    {children}
                </table>
            ),
            thead: ({children, ...props}) => (
                <thead style={{backgroundColor:'#f6f8fa',borderBottom:'1px solid #d1d5da'}} {...props}>
                    {children}
                </thead>
            ),
            tbody: ({children, ...props}) => (
                <tbody style={{borderBottom:'1px solid #d1d5da'}} {...props}>
                    {children}
                </tbody>
            ),
            tr: ({children, ...props}) => (
                <tr style={{borderBottom:'1px solid #d1d5da'}} {...props}>
                    {children}
                </tr>
            ),
            th: ({children, ...props}) => (
                <th style={{padding:'0.5em',textAlign:'left',borderBottom:'1px solid #d1d5da'}} {...props}>
                    {children}
                </th>
            ),
            td: ({children, ...props}) => (
                <td style={{padding:'0.5em',textAlign:'left',borderBottom:'1px solid #d1d5da'}} {...props}>
                    {children}
                </td>
            ),
        }}/>
    )
}
