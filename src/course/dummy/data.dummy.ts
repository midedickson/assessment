import { DummyCourse } from './course.dummy';

const courseDummies: DummyCourse[] = [
  {
    title: 'Angular',
    description: 'A framework for building single-page applications',
    author: 'Mide Dickson',
  },
  {
    title: 'React',
    description: 'A JavaScript library for building user interfaces',
    author: 'Sim Shagaya',
  },
  {
    title: 'Information Technology',
    description:
      'Understand how to develop complex In formation Communication systems are built',
    author: 'Juliet Ehimuan',
  },
  {
    title: 'Software Engineering',
    description: 'Become a world-class software engineer!',
    author: 'Abubakar Sulieman',
  },
];

const coursesWithVideos = courseDummies.map((course) => ({
  ...course,
  videos: [
    {
      url:
        'http://example.com/video1-for-' +
        course.title.replace(/\s+/g, '-').toLowerCase(),
    },
    {
      url:
        'http://example.com/video2-for-' +
        course.title.replace(/\s+/g, '-').toLowerCase(),
    },
  ],
}));

export { coursesWithVideos };
