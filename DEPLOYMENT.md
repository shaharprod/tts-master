# 🚀 הוראות העלאה לגיטהב - Hebrew TTS

## שלב 1: יצירת Repository בגיטהב

1. **לך לגיטהב** - https://github.com
2. **לחץ על "New repository"** (כפתור ירוק)
3. **שם ה-repository**: `tts-master`
4. **תיאור**: "Hebrew Text-to-Speech Application"
5. **בחר Public** (חשוב ל-GitHub Pages)
6. **אל תסמן** "Add README" (כבר יש לנו)
7. **לחץ "Create repository"**

## שלב 2: חיבור Repository המקומי לגיטהב

```bash
# הוסף את ה-remote repository
git remote add origin https://github.com/shaharprod/tts-master.git

# העלה את הקבצים
git branch -M main
git push -u origin main
```

## שלב 3: הפעלת GitHub Pages

1. **לך ל-Settings** של ה-repository
2. **גלול למטה ל-"Pages"** (בצד שמאל)
3. **תחת "Source"** בחר "Deploy from a branch"
4. **בחר branch**: `main`
5. **בחר folder**: `/ (root)`
6. **לחץ "Save"**

## שלב 4: בדיקת האתר

- **הכתובת תהיה**: `https://shaharprod.github.io/tts-master/`
- **זמן הפעלה**: 5-10 דקות עד שהאתר יהיה זמין
- **עדכונים**: כל push חדש יעדכן את האתר אוטומטית

## ✅ מה יקרה אחרי ההעלאה:

1. **האתר יהיה זמין** בכתובת שביקשת
2. **כל אחד יוכל לגשת** אליו מכל מקום
3. **האתר יעבוד מושלם** על כל המכשירים
4. **עדכונים אוטומטיים** בכל שינוי שתעשה

## 🔧 אם יש בעיות:

### שגיאת שם משתמש:
```bash
git remote set-url origin https://github.com/[השם-הנכון-שלך]/tts-master.git
```

### שגיאת הרשאות:
- ודא שיש לך הרשאות ל-repository
- נסה עם SSH במקום HTTPS

### האתר לא עולה:
- חכה 10-15 דקות
- בדוק ב-Settings → Pages שההגדרות נכונות
- ודא שה-repository הוא Public

## 📱 בדיקה סופית:

אחרי שהאתר עולה, בדוק:
- ✅ האתר נטען
- ✅ הטקסט בעברית מוצג נכון
- ✅ כפתור "השמע טקסט" עובד
- ✅ הקולות העבריים זמינים
- ✅ העיצוב נראה טוב על מובייל

---

**🎉 מזל טוב! האתר שלך יהיה זמין ב-https://shaharprod.github.io/tts-master/**
