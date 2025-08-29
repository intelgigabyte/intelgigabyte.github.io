const members = [
    { username: 'Salvogiangri', group: 'UN1CA Team', position: 'Project Founder/Developer' },
    { username: 'DavidArsene', group: 'UN1CA Team', position: 'Help and time' },
    { username: 'paulowesll', group: 'UN1CA Team', position: 'Help and support' },
    { username: 'Simon1511', group: 'UN1CA Team', position: 'Support and some of the device-specific patches' },
    { username: 'ananjaser1211', group: 'UN1CA Team', position: 'Troubleshooting and his time' },
    { username: 'iDrinkCoffee-TG' , group: 'UN1CA Team', position: ' Documentation revisioning' },
    { username: 'lineageos' , group: 'UN1CA Team', position: 'Their original OTA updater implementation' },
    { username: 'RisenID' , group: 'UN1CA Team', position: 'Documentation revisioning' },
    { username: 'ShaDisNX255', group: 'UN1CA Team', position: 'Time and for his NcX ROM which inspired this project' },
    { username: 'Yagzie', group: 'NERV Team', position: 'Project Founder/Developer/Maintainer of a52sxq/m52xq/a73xq/r9q/r9q2' },
    { username: 'Ksawlii', group: 'NERV Team', position: 'Maintainer of a53x' },
    { username: 'pascua28', group: 'NERV Team', position: 'Maintainer of a71' },
    { username: 'intelgigabyte', group: 'NERV Team', position: 'Web Designer' },
    { username: 'Alexfurina', group: 'NERV Team', position: 'Maintainer of a51' },
];

const teamContainer = document.getElementById('team');

const groupedMembers = {};
members.forEach(member => {
    if (!groupedMembers[member.group]) {
        groupedMembers[member.group] = [];
    }
    groupedMembers[member.group].push(member);
});

function createMemberCard(member, avatarUrl) {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
<img src="${avatarUrl}" alt="${member.username}'s avatar" class="avatar" />
<div class="username">@${member.username}</div>
<div class="position">${member.position}</div>
`;
    return card;
}

function fetchAvatar(member, membersRow) {
    fetch(`https://api.github.com/users/${member.username}`)
        .then(res => res.json())
        .then(data => {
            let avatarUrl = `https://github.com/${member.username}.png?size=120&default=identicon`;
            if (data && typeof data.avatar_url === 'string' && data.avatar_url) {
                avatarUrl = data.avatar_url;
            }
            const card = createMemberCard(member, avatarUrl);
            membersRow.appendChild(card);
        })
        .catch(err => {
            console.warn(`Failed to fetch from API for ${member.username}. Using identicon fallback.`, err);
            const fallbackUrl = `https://github.com/${member.username}.png?size=120&default=identicon`;
            const card = createMemberCard(member, fallbackUrl);
            membersRow.appendChild(card);
        });
}

Object.entries(groupedMembers).forEach(([position, groupMembers]) => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('team-group');

    const title = document.createElement('div');
    title.classList.add('team-title');
    title.textContent = position;
    groupDiv.appendChild(title);

    const membersRow = document.createElement('div');
    membersRow.classList.add('team-members');

    groupMembers.forEach(member => {
        fetchAvatar(member, membersRow);
    });

    groupDiv.appendChild(membersRow);
    teamContainer.appendChild(groupDiv);
});
