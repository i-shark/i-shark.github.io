import {translate} from "@/utils/general";
import buttonCopy from "@/components/ButtonCopy/ButtonCopy.vue";

export default {
    name: "share_block",
    components: {
        buttonCopy
    },
    computed: {
        page_link() {
            return location.href;
        }
    },
    methods: {
        translate
    },
    data() {
        return {
            dialog: false,
            share_links: {
                telegram: `tg://msg_url?url=${encodeURIComponent(location.href)}`,
                whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(location.href)}`,
                vk: `https://vk.com/share.php?url=${encodeURIComponent(location.href)}`,
                twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}`,
                facebook: `https://www.facebook.com/sharer.php?u=${encodeURIComponent(location.href)}`,
                ok: `https://connect.ok.ru/offer?url=${encodeURIComponent(location.href)}`
            }
        };
    }
};
