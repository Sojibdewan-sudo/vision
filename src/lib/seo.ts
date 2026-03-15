export const updateSEO = (page: string) => {
  const generateSchema = (name: string, description: string, url: string, faqs: {q: string, a: string}[]) => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": name,
          "description": description,
          "applicationCategory": "CalculatorApplication",
          "operatingSystem": "All",
          "url": `https://vision.aivoro.site${url}`
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }
      ]
    };
  };

  const seoData: Record<string, { title: string; description: string; schema?: any }> = {
    home: {
      title: "Vision AI Tools – Free Online Calculators & Converters",
      description: "Convert units instantly, use advanced scientific calculator, and solve real-life problems with AI. Free online smart calculator tool.",
    },
    percentage: {
      title: "Percentage Calculator – Free Online Tool | Vision AI Tools",
      description: "Calculate percentages instantly with our free Percentage Calculator. Find percentage increase, decrease, and percentage of numbers quickly online.",
      schema: generateSchema(
        "Percentage Calculator",
        "Calculate percentages instantly with our free Percentage Calculator.",
        "/percentage",
        [
          { q: "How do I calculate percentage of a number?", a: "Divide the percentage by 100 and multiply it by the number. For example, to find 15% of 200: (15 / 100) × 200 = 30." },
          { q: "How do I calculate a percentage increase?", a: "Use the 'Percentage Change' calculator. Enter the original value in the 'From' field and the new value in the 'to' field. The formula is ((New Value - Old Value) / Old Value) × 100." }
        ]
      )
    },
    converter: {
      title: "Unit Converter – Free Online Tool | Vision AI Tools",
      description: "Instantly convert between 100+ units across 13 categories including length, weight, temperature, and more.",
      schema: generateSchema(
        "Unit Converter",
        "Instantly convert between hundreds of units of measurement with our free online Unit Converter.",
        "/converter",
        [
          { q: "Which units are supported?", a: "We currently support conversions for Length, Area, Volume, Mass, Time, Temperature, Speed, Pressure, Energy, Power, Voltage, Density, and Data Storage." },
          { q: "Can I convert metric to imperial units?", a: "Absolutely. The tool seamlessly converts between metric and imperial systems across all supported categories." }
        ]
      )
    },
    scientific: {
      title: "Scientific Calculator – Free Online Tool | Vision AI Tools",
      description: "Free online scientific calculator with advanced mathematical functions, trigonometry, logarithms, and more.",
      schema: generateSchema(
        "Scientific Calculator",
        "Solve complex mathematical problems instantly with our free online Scientific Calculator.",
        "/scientific",
        [
          { q: "Does it support trigonometric functions?", a: "Yes, it fully supports sine (sin), cosine (cos), and tangent (tan) functions." },
          { q: "How do I calculate a square root?", a: "Press the √ button, enter the number, close the parenthesis, and hit calculate. For example: sqrt(16) = 4." }
        ]
      )
    },
    ai: {
      title: "AI Text Calculator – Free Online Tool | Vision AI Tools",
      description: "Ask math and financial questions in plain English. Our AI calculator provides step-by-step solutions instantly.",
      schema: generateSchema(
        "AI Text Calculator",
        "Solve complex math and financial problems using plain English with our free AI Text Calculator.",
        "/ai",
        [
          { q: "What kind of questions can I ask?", a: "You can ask anything from basic math to complex financial scenarios." },
          { q: "Can it solve algebra or calculus?", a: "Yes, the AI is capable of solving algebraic equations and basic calculus problems, providing the steps along the way." }
        ]
      )
    },
    age: {
      title: "Age Calculator – Free Online Tool | Vision AI Tools",
      description: "Instantly calculate your exact age from date of birth. Free and accurate age calculator tool.",
      schema: generateSchema(
        "Age Calculator",
        "Instantly calculate your exact age in years, months, and days with our free online Age Calculator.",
        "/age",
        [
          { q: "How is my exact age calculated?", a: "The calculator determines the difference between your date of birth and the current date, accounting for leap years and varying month lengths." },
          { q: "Can I calculate my age on a future date?", a: "Yes, simply change the Current Date field to any future date." }
        ]
      )
    },
    loan: {
      title: "Loan Calculator – Free Online Tool | Vision AI Tools",
      description: "Calculate total payable amount, interest breakdown, and view amortization summary for your loan.",
      schema: generateSchema(
        "Loan Calculator",
        "Calculate your Equated Monthly Installment (EMI), total interest payable, and the overall cost of your loan.",
        "/loan",
        [
          { q: "Why is the total interest so high?", a: "In the early years of a loan, a larger portion of your EMI goes towards paying off the interest rather than the principal." },
          { q: "How can I reduce my total interest?", a: "You can reduce your total interest by choosing a shorter loan tenure, negotiating a lower interest rate, or making prepayments." }
        ]
      )
    },
    interest: {
      title: "Interest Calculator – Free Online Tool | Vision AI Tools",
      description: "Free online interest calculator. Calculate simple and compound interest instantly with visual breakdowns.",
      schema: generateSchema(
        "Interest Calculator",
        "Calculate simple and compound interest easily with our free online Interest Calculator.",
        "/interest",
        [
          { q: "What is the difference between simple and compound interest?", a: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal amount and also on the accumulated interest of previous periods." },
          { q: "How does compounding frequency affect the total interest?", a: "The more frequently interest is compounded, the higher the total interest earned or paid will be." }
        ]
      )
    },
    typing: {
      title: "Typing Speed Test – Free Online Tool | Vision AI Tools",
      description: "Test your typing speed online in English and Bangla. Measure WPM, CPM, and accuracy with customizable time and difficulty levels.",
      schema: generateSchema(
        "Typing Speed Test",
        "Test your typing speed online in English and Bangla. Measure WPM, CPM, and accuracy.",
        "/typing-test",
        [
          { q: "How is WPM calculated?", a: "WPM (Words Per Minute) is calculated by dividing the total number of correctly typed characters by 5 and then dividing by the time elapsed in minutes." },
          { q: "What is considered a good typing speed?", a: "An average typing speed is around 40 WPM. Speeds above 60 WPM are considered good." }
        ]
      )
    },
    'word-counter': {
      title: "Word Counter – Free Online Tool | Vision AI Tools",
      description: "Free online word counter tool to count words, characters, sentences, paragraphs and reading time instantly.",
      schema: generateSchema(
        "Word Counter",
        "Count words, characters, sentences, and paragraphs instantly with our free online Word Counter.",
        "/word-counter",
        [
          { q: "Does it count spaces as characters?", a: "Yes, the standard 'Characters' metric includes spaces. However, we also provide a 'Characters (No Spaces)' metric." },
          { q: "How is reading time calculated?", a: "Reading time is estimated based on an average reading speed of 200 words per minute." }
        ]
      )
    },
    about: {
      title: "About Us | Vision AI Tools",
      description: "Learn more about Vision AI Tools, your all-in-one platform for precise calculations and intelligent problem-solving.",
    },
    terms: {
      title: "Terms & Conditions | Vision AI Tools",
      description: "Read the terms and conditions for using Vision AI Tools services.",
    },
    privacy: {
      title: "Privacy Policy | Vision AI Tools",
      description: "Read our privacy policy to understand how we handle your data.",
    }
  };

  const data = seoData[page] || seoData.home;

  document.title = data.title;
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', data.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', data.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', data.description);

  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute('content', data.title);

  const twitterDesc = document.querySelector('meta[property="twitter:description"]');
  if (twitterDesc) twitterDesc.setAttribute('content', data.description);

  // Update Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  
  // Map page to path
  const pathMap: Record<string, string> = {
    home: '/',
    percentage: '/percentage',
    converter: '/converter',
    scientific: '/scientific',
    ai: '/ai',
    age: '/age',
    loan: '/loan',
    interest: '/interest',
    typing: '/typing-test',
    'word-counter': '/word-counter',
    about: '/about',
    terms: '/terms',
    privacy: '/privacy'
  };
  
  const currentPath = pathMap[page] || '/';
  canonicalLink.setAttribute('href', `https://vision.aivoro.site${currentPath}`);

  // Update Schema
  let schemaScript = document.getElementById('dynamic-schema') as HTMLScriptElement;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'dynamic-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  
  if (data.schema) {
    schemaScript.textContent = JSON.stringify(data.schema);
  } else {
    schemaScript.textContent = '';
  }
};
