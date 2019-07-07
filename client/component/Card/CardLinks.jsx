
import React from 'react';

import Card from './Card';

const CardLinks = () => (
  <Card title="Links">
    <a href="https://www.id-chain.org/" target="_blank">Website</a><br />
    {/* <a href="https://bitcointalk.org/" target="_blank">Bitcointalk</a><br /> */}
    <a href="https://github.com/interactive-decisions-chain/idc-core" target="_blank">Github</a><br />
    <a href="https://www.reddit.com/user/ID_Chain" target="_blank">Reddit</a><br />
    <a href="https://discord.gg/YVaZjxr" target="_blank">Discord</a><br />
    <a href="https://t.me/IDChain_Official" target="_blank">Telegram</a><br />
    <a href="https://twitter.com/IDChain_Team" target="_blank">Twitter</a><br />
    <a href="https://steemit.com/@idchain" target="_blank">Steemit</a>
  </Card>
);

export default CardLinks;
