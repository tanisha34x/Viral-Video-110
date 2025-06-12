import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const referer = context.req.headers.referer || '';
  const hasFBCLID = 'fbclid' in context.query;

  if (referer.includes('facebook.com') || hasFBCLID) {
    return {
      redirect: {
        destination: 'https://tapatap.com/',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome to My Next.js App!</h1>
      <p>This is the homepage.</p>
    </div>
  );
}
