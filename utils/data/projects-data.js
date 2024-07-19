import ayla from '/public/image/ayla.jpg';
import crefin from '/public/image/crefin.jpg';
import realEstate from '/public/image/real-estate.jpg';
import travel from '/public/image/travel.jpg';

export const projectsData = [
    {
        id: 1,
        name: 'Nmap Scanner Using Flask',
        description: "This Flask application allows users to perform Nmap scans on target IP addresses and generate a PDF report of the scan results.The application stores the scan results and user-submitted email addresses in a MySQL database for future reference.",
        tools: ['Flask, MySQL, HTML, CSS'],
        role: 'Backend Developer',
        code: '',
        demo: '',
        image: 'crefin',
    },
    {
        id: 2,
        name: 'Dealer Registration System',
        description: 'The Dealer Registration System is a web application that allows companies to register and access detailed information about our products, prices, and directly communicate with us.Additionally, it enables our HR team to perform detailed analysis of business relationships based on location.',
        tools: ["Nodejs, Expressjs, MongoDB, TailwindCSS,Gmail passkey,React"],
        role: 'Full Stack Developer',
        code: '',
        demo: '',
        image: travel,
    },
    {
        id: 3,
        name: 'Crypto Analyzer App',
        description: "It's Simple app that fetch all crypto coins charts from trading view using APIs and give a all features to analyse the market.This app is completely RESTful.",
        tools: ['APIs', 'Android Studio', 'kotlin','Dataframes'],
        code: '',
        role: 'Android Developer',
        demo: '',
        image: realEstate,
    },
    {
        id: 4,
        name: 'AWS Cloud Deployment using S3 Bucket',
        description: "It's Deployment of Static Website using AWS S3 bucket.Using AWS CloudFront As CDN.",
        tools: ['AWS Cloud Console'],
        code: '',
        demo: '',
        image: ayla,
        role: 'Cloud Engineer',
    }
];


// Do not remove any property.
// Leave it blank instead as shown below

// {
//     id: 1,
//     name: '',
//     description: "",
//     tools: [],
//     role: '',
//     code: '',
//     demo: '',
//     image: crefin,
// },