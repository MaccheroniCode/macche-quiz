import { Kbd } from '@heroui/react';
import { memo } from 'react';
import Markdown, { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const COMPONENTS: Components = {
	code: (props) => {
		const { children, className, node, ...rest } = props;
		const match = /language-(\w+)/.exec(className || '');
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
