import { fetchDictsByCat } from '@/api/dictionary';

export default {
    getDictsByCat: async function(category) {
        const resp = await fetchDictsByCat(category);
        const dictionary = resp.data.data.dictionary;
        const options = [];
        dictionary.forEach(item => {
            options.push({
                value: item.value,
                label: item.label
            });
        });
        return options;
    }
};
