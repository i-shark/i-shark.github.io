/** @todo create npm package to generate Vcard with full necessary information */
const path = require("path"),
    fs = require("fs"),
    dotenv = require("dotenv"),
    urlParser = require("url-parse"),
    momentTz = require("moment-timezone");

const env = dotenv.parse(fs.readFileSync(path.resolve("./.env")));
const lang = env["VUE_APP_LANG"];
let url, initialData = fs.readFileSync(path.resolve("./src/data/user_data.json"));
const userData = JSON.parse(initialData.toString());
const moment = momentTz();

if (userData.timezone) {
    moment.tz(userData.timezone);
}

const names = [];
let firstName = "", middleName = "", lastName = "";
["first_name", "middle_name", "last_name"].forEach(name => {
    if (userData?.[name]) {
        names.push(userData[name][lang]);
    }
});

if (userData.first_name[lang]) {
    firstName = userData.first_name[lang];
}

if (userData.middle_name[lang]) {
    middleName = userData.middle_name[lang];
}

if (userData.last_name[lang]) {
    lastName = userData.last_name[lang];
}

const vCard = ["BEGIN:VCARD", "VERSION:3.0"];
vCard.push(`N:${lastName};${firstName};${middleName};;`);
vCard.push(`FN:${names.join(" ")}`);

if (userData.gender) {
    vCard.push(`GENDER:${userData.gender}`);
}

if (userData.birthday) {
    vCard.push(`BDAY:${userData.birthday}`);
}

if (userData.phone) {
    vCard.push(`TEL;type=CELL;type=VOICE;type=pref:${userData.phone.value.formatted}`);
}

if (userData.socials?.facebook) {
    vCard.push(`X-SOCIALPROFILE;type=facebook.com:${userData.socials.facebook}`);
}

let itemIndex = 1;

if (userData.work) {
    const work = userData.work;
    if (work.name) {
        vCard.push(`ORG:${work.name[lang]};`);
    }

    if (work.position) {
        vCard.push(`TITLE:${work.position.name[lang]}`);
    }

    if (work.website) {
        vCard.push(`item${itemIndex}.URL:${work.website[lang]}`);
        vCard.push(`item${itemIndex}.X-ABLabel:Официальный сайт`);
        itemIndex++;
    }

    if (work.location) {
        const address = {};
        ["country", "region", "locality", "street", "house", "entrance", "floor", "flat"].forEach(part => {
            if (work.location[part]) {
                address[part] = work.location[part]["name"][lang];
            } else {
                address[part] = "";
            }
        });

        if (work.location.zip_code) {
            address.zip_code = work.location.zip_code;
        } else {
            address.zip_code = "";
        }

        if (address?.entrance) {
            address.entrance = address.entrance + " подъезд";
        }

        if (address?.floor) {
            address.floor = address.floor + " этаж";
        }

        if (address.house) {
            address.street = [address.street, address.house, address?.entrance, address?.floor, address?.flat].filter(val => {
                return val ? val : "";
            }).join(", ");
        }

        vCard.push(`ADR;type=WORK:;;${address.street};${address.locality};${address.region};${address.zip_code};${address.country}`);
        if (work.coords) {
            vCard.push(`GEO:${work.coords[0]},${work.coords[1]}`);
        }
    }
}

if (userData.book_link) {
    vCard.push(`item${itemIndex}.URL;type=pref:${userData.book_link}`);
    vCard.push(`item${itemIndex}.X-ABLabel:Записаться`);
    itemIndex++;
}

const vcardLink = `${env["VUE_APP_DOMAIN"]}${env["VUE_APP_PATH"]}`;
vCard.push(`item${itemIndex}.URL;type=pref:${vcardLink}`);
vCard.push(`item${itemIndex}.X-ABLabel:Визитка`);
itemIndex++;

if (userData?.phone?.messengers?.telegram) {
    vCard.push(`item${itemIndex}.URL;type=pref:https://t.me/${userData.phone.messengers.telegram}`);
    vCard.push(`item${itemIndex}.X-ABLabel:Telegram`);
    itemIndex++;
}

if (userData?.phone?.messengers?.whatsapp) {
    vCard.push(`item${itemIndex}.URL;type=pref:https://wa.me/${userData.phone.value.short}`);
    vCard.push(`item${itemIndex}.X-ABLabel:WhatsApp`);
    itemIndex++;
}

["instagram", "github", "vk", "web", "maps"].forEach(social => {
    if (userData.socials?.[social]) {
        vCard.push(`item${itemIndex}.URL:${userData.socials[social]}`);
        let socialLabel;
        switch (social) {
            case "vk": socialLabel = "Вконтакте"; break;
            case "web": socialLabel = "Сайт"; break;
            case "maps": socialLabel = "Карты"; break;
            default: socialLabel = social;
        }

        vCard.push(`item${itemIndex}.X-ABLabel:${socialLabel}`);

        itemIndex++;
    }
});

if (userData.work && userData.work.website) {
    url = urlParser(userData.work.website[lang], true);
}

if (userData.emails) {
    userData.emails.forEach(email => {
        if (/\.edu$/.test(email)) {
            vCard.push(`EMAIL;type=INTERNET;type=PREF:${email}`);
        } else if (url?.host === email.split("@").pop()) {
            vCard.push(`EMAIL;type=INTERNET;type=WORK:${email}`);
        } else {
            vCard.push(`EMAIL;type=INTERNET;type=HOME:${email}`);
        }
    });
}

const avatar = fs.readFileSync(path.resolve(`./public/${env["VUE_APP_AVATAR_SRC"]}`), {encoding: "base64"});
vCard.push(`PHOTO;ENCODING=b;TYPE=JPEG:${avatar}`);

vCard.push(`TZ:${moment.format("Z")}`);
vCard.push(`SOURCE:${vcardLink}${env["VUE_APP_VCARD_SRC"]}`);
vCard.push(`REV:${moment.format("YYYY-MM-DDTHH:mm:SSZ")}`);
vCard.push("END:VCARD");

fs.writeFileSync(path.resolve(`./public/${env["VUE_APP_VCARD_SRC"]}`), vCard.join("\n"));
