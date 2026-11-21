import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type Props = { params: Promise<{ mdxPath?: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { mdxPath = [] } = await params;
  const { metadata } = await importPage(mdxPath);
  return { title: metadata.title, description: metadata.description, alternates: { canonical: `/${mdxPath.join("/")}` } };
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: Props) {
  const { mdxPath = [] } = await props.params;
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(mdxPath);
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={{ mdxPath }} />
    </Wrapper>
  );
}
