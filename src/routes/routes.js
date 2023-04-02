export const routes = [
    {
        component: () => import("@/components/Vcard/Vcard.vue"),
        meta: {
            title: "vcard"
        },
        name: "vcard",
        path: "*"
    },
    {
        component: () => import("@/components/Vcard/Vcard.vue"),
        meta: {
            title: "vcard"
        },
        name: "vcard",
        path: `${process.env.VUE_APP_PATH}:lang`,
    }
];
