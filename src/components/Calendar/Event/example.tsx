
import codeoLogo from 'data-url:@assets/png/codeo-logo.png';

const Logo = () => <img src={codeoLogo} />

export default Logo;

[
    {
        "template": "{time:dateStart+timeStart} - {time:dateEnd+timeEnd}",
        "fullWidth": true
    },

    {
        "value": "FullName",
        "_filter": {
            "_config": { ShowPersonalData: true }
        }
    },

    {
        "value": "Reference",
        "_filter": {
            "_config": { ShowPersonalData: false }
        }
    }
]