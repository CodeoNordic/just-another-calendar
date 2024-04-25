import ProfileIcon from 'jsx:@svg/profile.svg';
import EmailIcon from 'jsx:@svg/email.svg';
import PhoneIcon from 'jsx:@svg/phone.svg';

import performScript from '@utils/performScript';

const Contact: FC<FM.ContactRecord> = ({ FullName, Email, Phone, PrimaryKey }) => <button
    className="contact"
    onClick={() => performScript('onRecordClick', PrimaryKey)}
>
    <div className="row">
        <ProfileIcon width="20" height="20" />
        <p>{FullName}</p>
    </div>

    <div className="row">
        <EmailIcon width="20" height="20" />
        <p>{Email}</p>
    </div>

    <div className="row">
        <PhoneIcon width="20" height="20" />
        <p>{Phone}</p>
    </div>
</button>

export default Contact;