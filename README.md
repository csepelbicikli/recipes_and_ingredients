# Receptek és hozzávalók
Első beadandó 'Alkalmazások fejlesztése' tárgyból

## Követelményanalízis
	
1. Követelmények összegyűjtése
	1. Funkcionális elvárások
		- Felhasználóként szeretnék felvinni egy étel elkészítési útmutatóját, ill. azt módsítani/ törölni --> Recept felvitele/ módosítása törlése
		- Felhasználóként saját receptbe a hozzávalókat is bele szeretném rögzíteni, ill. azokat módostani törölni --> Hozzávalók rögzítése/ módosítása/ törlése
		- Felhasználóként meg szeretném tekinteni saját receptjeimet --> Recept megtekintése
		- Operátorként szeretném látni minden felhasználó összes receptjét, azokat módosíthatom v. törölhetem
		- Operátorként láthatom az összes felhasználó adatjait (kivéve jelszó), felhasznalókat törölhetek
	2. Nem funkcionális követelmények
		- Felhasználóbarát, ergonomikus elrendezés és kinézet.
		- Gyors működés.
		- Biztonságos működés: jelszavak tárolása, funkciókhoz való hozzáférés.
2. Szakterületi fogalomjegyzék
		- ingredient: hozzávaló angolul
		- recipe: recept angolul
Itt még hiányos
##Tesztelés
	
1. Tesztelési környezet bemutatása
	- A teszteléhez mocha keretrendszert használtam(parancs: `mocha <tesztfájlnév> --timeout 12000`). A maximális késleltetést 15 másodpercre állítottam(`--timeout 12000`) a cloud9 szerver autentikáció terén tapasztalt lassúsága miatt.
2. Egységtesztek
	- Az egységek (entity) közül a user-t teszteltem le a chai ellenőrzőkönyvtár segtségével mocha keretrendszerben. A kapcsolódó tesztfájl: `test/test1_usermodel.js`.
3. Funkcionális felületi tesztek
	- Funkcionális felületi tesztek elvégzéséhez a zombie.js kereteit használtam. A kapcsolódó tesztfájl: `test/test2_zombie.js`
4. Tesztesetek
	- Az entity tesztelésénél kitértem a `user`, létrehozására helyes és helytelen adatokkal, módsítására, keresésére, jelszó ellenőrzésére helyes és helytelen példával.
	- felületi tesztelés:
		- nyitólap meglátogatása
		- új recept készítése
		- operátor oldal meglátogatása 
			- ehhez szükséges a `.tmp/default.db` fájlban egy `kjozsi` nevű, `kjozsi` jelszavú felhasználó role-ját `operator`-ra átírni ill. egy `k`:`k` sima felhasználó
		- új hozzávaló hozzáadása az előbbi példában készített recepthez

##Felhasználói dökumentáció
	
	1. A futtatáshoz ajánlott hardver-, szoftver konfiguráció
		- A futtatáshoz minimum 2GHz-es egymagos processzor, legalább 512 MB RAM és 1GB szabad tárhely ajánlott. A program használatához valamilyen Linux operációs rendszer disztribúció szükséges.
	2. Telepítés lépései és a program használata
		- A fájlokat a GitHub 'Download Zip' opciója segítségével lehet letölteni ezután a saját szerverre kicsomagolással felrakható, majd a server.js futtatásával elindítható. Az esetleges függőségeket (dependency) a `npm install <fuggoseg> --save` paranccsal telepíthetjük.
