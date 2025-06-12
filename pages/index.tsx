import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const referer = ctx.req.headers.referer || '';
  const hasFB = 'fbclid' in ctx.query;

  if (referer.includes('facebook.com') || hasFB) {
    return {
      redirect: { destination: 'https://tapatap.com/', permanent: false },
    };
  }

  return { props: {} };
};

export default function Home() {
  return <h1>Welcome to My Next.js App!</h1>;
}
