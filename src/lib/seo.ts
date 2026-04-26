import { getToolContent } from './toolContent';

const BASE_URL = 'https://vision.aivoro.site';

interface SEOPage {
  title: string;
  description: string;
  path: string;
  appCategory?: string;
}

const pageMeta: Record<string, SEOPage> = {
  home: {
    title: 'Vision Tools - Free Online Calculators, Converters, and Productivity Tools',
    description:
      'Use free online calculators, converters, typing tools, and productivity utilities with clean UI, strong SEO content, and fast results.',
    path: '/',
  },
  percentage: {
    title: 'Percentage Calculator Online - Increase, Decrease, and Reverse Percentage',
    description:
      'Use our percentage calculator online to calculate percentage increase, decrease, percent of a number, and reverse percentage values instantly.',
    path: '/percentage',
    appCategory: 'FinanceApplication',
  },
  converter: {
    title: 'Unit Converter Online - Length, Weight, Temperature, Speed, and More',
    description:
      'Convert units instantly with our unit converter online for length, weight, temperature, pressure, area, speed, storage, and more.',
    path: '/converter',
    appCategory: 'UtilitiesApplication',
  },
  scientific: {
    title: 'Scientific Calculator Online - Advanced Math, Logs, Roots, and Trigonometry',
    description:
      'Use our scientific calculator online for trigonometry, powers, roots, logs, constants, and advanced math calculations.',
    path: '/scientific',
    appCategory: 'EducationalApplication',
  },
  age: {
    title: 'Age Calculator Online - Exact Age in Years, Months, Days',
    description:
      'Calculate exact age from date of birth online with years, months, days, total days lived, and next birthday countdown.',
    path: '/age',
    appCategory: 'UtilitiesApplication',
  },
  loan: {
    title: 'Loan Calculator Online - EMI, Interest, and Total Repayment',
    description:
      'Use our loan calculator online to estimate EMI, total interest, and full repayment for home, car, or personal loans.',
    path: '/loan',
    appCategory: 'FinanceApplication',
  },
  interest: {
    title: 'Interest Calculator Online - Simple and Compound Interest',
    description:
      'Calculate simple and compound interest online with maturity amount, interest earned, and compounding frequency options.',
    path: '/interest',
    appCategory: 'FinanceApplication',
  },
  typing: {
    title: 'Typing Speed Test Online - Check WPM, CPM, and Accuracy',
    description:
      'Take a typing speed test online in English or Bangla and measure WPM, CPM, accuracy, and mistakes in real time.',
    path: '/typing-test',
    appCategory: 'EducationalApplication',
  },
  'word-counter': {
    title: 'Word Counter Online - Count Words, Characters, Sentences, and Reading Time',
    description:
      'Count words, characters, sentences, paragraphs, and reading time instantly with our free online word counter.',
    path: '/word-counter',
    appCategory: 'UtilitiesApplication',
  },
  about: {
    title: 'About Vision Tools',
    description: 'Learn more about Vision Tools and our collection of free online calculators and productivity tools.',
    path: '/about',
  },
  terms: {
    title: 'Terms and Conditions - Vision Tools',
    description: 'Read the terms and conditions for using Vision Tools.',
    path: '/terms',
  },
  privacy: {
    title: 'Privacy Policy - Vision Tools',
    description: 'Read the privacy policy for Vision Tools.',
    path: '/privacy',
  },
};

const setMetaByName = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setMetaByProperty = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

export const updateSEO = (page: string) => {
  const data = pageMeta[page] || pageMeta.home;
  const tool = getToolContent(page);

  document.title = data.title;

  setMetaByName('description', data.description);
  setMetaByName('robots', 'index, follow');
  setMetaByProperty('og:title', data.title);
  setMetaByProperty('og:description', data.description);
  setMetaByProperty('og:type', 'website');
  setMetaByProperty('og:url', `${BASE_URL}${data.path}`);
  setMetaByName('twitter:card', 'summary_large_image');
  setMetaByName('twitter:title', data.title);
  setMetaByName('twitter:description', data.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${BASE_URL}${data.path}`);

  const oldSchema = document.getElementById('dynamic-schema');
  if (oldSchema) oldSchema.remove();

  const graph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vision Tools',
      url: BASE_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.title,
      description: data.description,
      url: `${BASE_URL}${data.path}`,
    },
  ];

  if (tool) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title,
      applicationCategory: data.appCategory || 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: tool.shortAnswer,
      url: `${BASE_URL}${tool.slug}`,
    });

    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  const script = document.createElement('script');
  script.id = 'dynamic-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
};
