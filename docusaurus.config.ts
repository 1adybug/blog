import { themes as prismThemes } from "prism-react-renderer"

import type * as Preset from "@docusaurus/preset-classic"
import type { Config } from "@docusaurus/types"

const config: Config = {
    title: "子虚伊人",
    tagline: "三人行，必有我师焉",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://your-docusaurus-site.example.com",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "1adybug", // Usually your GitHub org/user name.
    projectName: "blog", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "zh-Hans",
        locales: ["zh-Hans"],
    },

    presets: [
        [
            "classic",
            {
                docs: false,
                blog: {
                    routeBasePath: "/",
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    // editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
                    blogSidebarTitle: "所有文章",
                    blogSidebarCount: "ALL",
                    blogTitle: "博客",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "子虚伊人",
            logo: {
                alt: "My Site Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    href: "https://github.com/1adybug/blog",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "NPM",
                    items: [
                        {
                            label: "Easy Zustand",
                            href: "https://www.npmjs.com/package/easy-zustand",
                        },
                        {
                            label: "Deepsea Tools",
                            href: "https://www.npmjs.com/package/deepsea-tools",
                        },
                        {
                            label: "Deepsea Components",
                            href: "https://www.npmjs.com/package/deepsea-components",
                        },
                    ],
                },
                {
                    title: "更多",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/1adybug",
                        },
                    ],
                },
            ],
            copyright: `诗曰：所谓伊人，在水一方`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
    plugins: [
        [
            "@docusaurus/plugin-pwa",
            {
                debug: true,
                offlineModeActivationStrategies: ["appInstalled", "standalone", "queryString"],
                pwaHead: [
                    {
                        tagName: "link",
                        rel: "icon",
                        href: "/img/docusaurus.png",
                    },
                    {
                        tagName: "link",
                        rel: "manifest",
                        href: "/manifest.json", // your PWA manifest
                    },
                    {
                        tagName: "meta",
                        name: "theme-color",
                        content: "rgb(37, 194, 160)",
                    },
                ],
            },
        ],
    ],
}

export default config
