const members = [
    { username: 'rmuxnet', group: 'Core', position: 'Project Founder/Developer' },
    { username: 'Exo1i', group: 'Core', position: 'Project Manager/Developer' },
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
