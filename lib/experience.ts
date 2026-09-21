import type { Locale } from './portfolio-state';

type Translation = Record<Locale, string>;
export type Experience = {
  company: string;
  initials: string;
  role: Translation;
  dates: Translation;
  stack: string[];
  points: Record<Locale, string[]>;
};

// Dates and results supplied by Wilder Mancera. Latest role first.
export const experience: Experience[] = [
  {
    company: 'TECHBRAINS SOFTWARE SRL',
    initials: 'TB',
    role: { es: 'Ingeniero de software', en: 'Software Engineer' },
    dates: { es: 'Febrero 2026 — Actualidad', en: 'February 2026 — Present' },
    stack: [
      '.NET',
      'Angular',
      'React',
      'Node.js',
      'SQL Server',
      'MongoDB',
      'GitHub',
      'SCRUM',
      'Azure',
      'AWS',
    ],
    points: {
      es: [
        'Desarrollo de soluciones para distintos clientes y modernización de sistemas empresariales, reduciendo tiempos de procesamiento hasta un 60%.',
        'Optimización de consultas y procesos de bases de datos, con mejoras de rendimiento de aproximadamente un 70%.',
        'Automatización de integraciones y procesos operativos, reduciendo las tareas manuales en más de un 50%.',
        'Mejoras de arquitectura y mantenimiento que redujeron los incidentes recurrentes aproximadamente un 40%.',
      ],
      en: [
        'Developed solutions for multiple clients and modernized enterprise systems, reducing processing times by up to 60%.',
        'Optimized database queries and processes, achieving performance improvements of approximately 70%.',
        'Automated integrations and operational processes, reducing manual tasks by more than 50%.',
        'Implemented architecture and maintenance improvements that reduced recurring incidents by approximately 40%.',
      ],
    },
  },
  {
    company: 'DEXTRA SRL',
    initials: 'DX',
    role: { es: 'Consultor de software', en: 'Software Consultant' },
    dates: { es: 'Junio 2025 — Febrero 2026', en: 'June 2025 — February 2026' },
    stack: ['Microsoft Dynamics 365', 'Business Central', 'AL'],
    points: {
      es: [
        'Diseño e implementación de extensiones, integraciones y automatizaciones en Microsoft Dynamics 365 Business Central con AL.',
        'Lideré la reestructuración del código de localización y optimicé la lógica de negocio en AL, mejorando el rendimiento general un 15% y reduciendo tiempos de procesamiento de datos.',
        'Colaboré en una integración entre Business Central y bancos locales para automatizar la transmisión de archivos de pago y la conciliación.',
        'Desarrollé un algoritmo de traducción automática de objetos y archivos .g.xlf, acelerando un 20% el ciclo de entrega de extensiones multilingües.',
      ],
      en: [
        'Designed and implemented custom extensions, integrations, and process automation in Microsoft Dynamics 365 Business Central using AL.',
        'Led the restructuring of the localization codebase and optimized AL business logic, improving overall performance by 15% and reducing data processing times.',
        'Collaborated on an integration between Business Central and local banks to automate payment file transmission and reconciliation.',
        'Developed an algorithm for automated translation of objects and .g.xlf files, accelerating the delivery cycle of multilingual extensions by 20%.',
      ],
    },
  },
  {
    company: 'Banco BACC',
    initials: 'BA',
    role: { es: 'Desarrollador de software', en: 'Software Developer' },
    dates: { es: 'Abril 2023 — Junio 2025', en: 'April 2023 — June 2025' },
    stack: ['.NET Core', 'Angular', 'SQL Server', 'GitLab', 'Agile SCRUM'],
    points: {
      es: [
        'Desarrollé un sistema de gestión de comisiones que redujo un 90% el tiempo de procesamiento de nómina.',
        'Implementé un sistema de solicitudes internas que incrementó un 70% la digitalización de procesos.',
        'Construí un panel de préstamos que aumentó un 25% las solicitudes de crédito.',
        'Reforcé la seguridad de soluciones externas mediante autenticación y técnicas criptográficas, y promoví prácticas de desarrollo para mejorar mantenibilidad, escalabilidad y fiabilidad.',
      ],
      en: [
        'Developed a commission management system that reduced payroll processing time by 90%.',
        'Implemented an internal request management system, increasing process digitalization by 70%.',
        'Built a loan dashboard that increased loan applications by 25%.',
        'Enhanced the security of external software through authentication and cryptographic techniques, and promoted development practices to improve maintainability, scalability, and reliability.',
      ],
    },
  },
  {
    company: 'Aloe Software SRL',
    initials: 'AL',
    role: { es: 'Desarrollador de software', en: 'Software Developer' },
    dates: { es: 'Enero 2022 — Junio 2022', en: 'January 2022 — June 2022' },
    stack: ['React', '.NET Core', 'SQL Server', 'Azure DevOps'],
    points: {
      es: [
        'Mejoré el rendimiento de una aplicación web mediante refactorización de código y optimización de procesos, logrando un sistema más eficiente y con mejor respuesta.',
      ],
      en: [
        'Improved the performance of a web application through code refactoring and process optimization, resulting in a more efficient and responsive system.',
      ],
    },
  },
  {
    company: 'Coding Space',
    initials: 'CS',
    role: { es: 'Instructor de programación', en: 'Coding Instructor' },
    dates: {
      es: 'Octubre 2021 — Enero 2022',
      en: 'October 2021 — January 2022',
    },
    stack: ['Scratch', 'JavaScript'],
    points: {
      es: [
        'Enseñé programación y resolución de problemas a estudiantes de entre 6 y 17 años.',
        'Diseñé un currículo personalizado que aumentó la participación de los estudiantes y mejoró sus habilidades de programación un 50%.',
      ],
      en: [
        'Taught coding and problem-solving skills to students aged 6 to 17.',
        'Developed a customized curriculum that increased student engagement and improved coding proficiency by 50%.',
      ],
    },
  },
];
