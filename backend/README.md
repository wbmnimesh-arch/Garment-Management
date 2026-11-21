# CUT FREE backend

මෙය Express සහ MongoDB (Mongoose) භාවිතා කරන API එකයි. Frontend එකේ `/api/auth/login` සහ `/api/auth/register` ඉල්ලීම් සමඟ ගැළපෙනවා.

## MongoDB Atlas அமைப்பு

1. Atlas-ல் cluster එකක් තනා, **Database Access** යටතේ database user කෙනෙක් සාදන්න. Username/password එක Website login account එකේ විස්තර නොවිය යුතුයි.
2. **Network Access** යටතේ backend ධාවනය වන පරිගණකයට හෝ server එකට අවසර දෙන්න. හැකි නම් නිශ්චිත IP එකක් භාවිතා කරන්න.
3. `.env.example` ගොනුව copy කර `backend/.env` නමින් සුරකින්න.
4. `MONGO_URI` අගයට Atlas connection string එක දාන්න. `<database-user>`, `<url-encoded-password>`, සහ `<cluster-name>` වෙනුවට ඔබේ අගයන් දාන්න. Password එකේ `@`, `/`, `:` වැනි සලකුණු තිබේ නම් ඒවා URL-encode කරන්න.
5. `JWT_SECRET` සඳහා අවම වශයෙන් අකුරු 32ක අහඹු රහසක් යොදන්න. `.env` කිසිවිටෙක source control හෝ chat එකට දාන්න එපා.

## ආරම්භ කිරීම

```sh
cd my-website/backend
npm install
npm run db:check
npm run dev
```

Frontend එක වෙනම Terminal එකක `my-website` folder එකෙන් `npm run dev` යොදා ආරම්භ කරන්න. Vite `/api` ඉල්ලීම් `http://localhost:5001` වෙත යවයි. API තත්ත්වය `http://localhost:5001/api/health` හරහා බලන්න පුළුවන්.

`MongoDB rejected the database username or password` என்றால் Atlas **Database Access**-ல் database user password-ஐ reset செய்து, `backend/.env`-ல் `MONGO_URI`-ஐ புதுப்பித்து `npm run db:check` மீண்டும் இயக்கவும். கடவுச்சொல்லை chat-ல் பகிர வேண்டாம்.

## API

- `POST /api/auth/register` — අනුමැතිය බලාපොරොත්තු වන Employee ගිණුමක් සාදයි. Public registration හරහා උසස් භූමිකාවක් තෝරාගත නොහැක.
- `POST /api/auth/login` — සාර්ථක login එකකදී `HttpOnly` session cookie එකක් නිකුත් කරයි.
- `POST /api/auth/logout` — session cookie එක ඉවත් කරයි.
- `GET /api/auth/me` — signed-in user විස්තර ලබාදෙයි.
- `GET /api/admin/pending-users` — Owner සහ HR සඳහා pending ගිණුම් පෙන්වයි.
- `PATCH /api/admin/users/:id/status` — Owner හෝ HR ගිණුමක් සක්‍රිය/අක්‍රිය කරයි. HR හට Employee ගිණුම් පමණක් වෙනස් කළ හැක.
- `PATCH /api/admin/users/:id/role` — Owner පමණක් role වෙනස් කරයි.

පළමු Owner ගිණුම සඳහා `.env` තුළ `BOOTSTRAP_OWNER_NAME`, `BOOTSTRAP_OWNER_ID`, `BOOTSTRAP_OWNER_EMAIL`, `BOOTSTRAP_OWNER_PASSWORD` (අවම අකුරු 16) තාවකාලිකව දමා `npm run bootstrap-owner` ක්‍රියාත්මක කරන්න. සාර්ථක වූ පසු එම අගයන් `.env` වෙතින් ඉවත් කරන්න. Active Owner කෙනෙක් දැනටමත් ඇත්නම් bootstrap ක්‍රියාත්මක නොවේ.

Login සහ registration ඉල්ලීම් සීමාව එක් backend process එකක් තුළ පමණක් ගණනය වේ. Server කිහිපයක් භාවිතා කරන විට එකම සීමාව යෙදීමට හවුල් rate-limit store එකක් අවශ්‍යයි. Production එකේ HTTPS භාවිතා කර `NODE_ENV=production` සහ නිවැරදි `CLIENT_ORIGIN` සකසන්න.
