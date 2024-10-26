const abbreviate = (str) => {
    const exclusions = new Set(['of', 'and', 'the', 'in', 'for', 'a', 'an', 'to', 'with']);
    const words = str.split(' ').filter(word => !exclusions.has(word.toLowerCase()) && word.length > 1);
    const initials = words.map(word => word[0].toUpperCase());

    return initials.join('');
};


export default abbreviate;