import { cn, Kbd } from '@heroui/react';
import { memo } from 'react';
import Markdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const COMPONENTS: Components = {
	a: ({ className, ...props }) => <a className={cn('link', className)} {...props} />,
	code: (props) => {
		const { children, className, node, ...rest } = props;
		if (className) {
			const match = /language-([\w+]+)/.exec(className || '');
			if (match) {
				return (
					<SyntaxHighlighter
						PreTag="div"
						children={String(children).replace(/\n$/, '')}
						language={match[1]}
						style={vscDarkPlus}
						showLineNumbers
					/>
				);
			}
		} else {
			const match = /macche-language-([\w+]+) ((?!\n).*)/.exec(String(children));
			if (match) {
				return (
					<SyntaxHighlighter
						PreTag="span"
						children={match[2]}
						language={match[1]}
						style={vscDarkPlus}
						customStyle={{ padding: '0.3em', borderRadius: '0.4em' }}
					/>
				);
			}
		}
		return (
			<Kbd {...rest} className={className}>
				<Kbd.Content>
					<code>{children}</code>
				</Kbd.Content>
			</Kbd>
		);
	}
};

interface MarkdownContentProps {
	readonly markdown: string;
}

const MarkdownContent = memo<MarkdownContentProps>(({ markdown }) => {
	return (
		<Markdown components={COMPONENTS} remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
	);
});

export default MarkdownContent;
