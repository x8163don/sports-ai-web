import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        'node_modules/daisyui/dist/**/*.js',
        'node_modules/react-daisyui/dist/**/*.js',
    ], theme: {
        extend: {
            typography: ({theme}) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.900'),
                    },
                },
            }),
        },
    },
    daisyui: {
        themes: ["light", "dark"],
    },
    plugins: [daisyui, typography],
}

