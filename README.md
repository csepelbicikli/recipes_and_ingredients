
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
3. Használatieset-modell
	1. Szerepkörök
		- vendég('guest'): a nyitóoldal tartalmához fér hozzá, mást nem tud
		- normál felhasználó('normal'): a vendég szerepkörén túl tud saját recepteket megtekinteni, feltölteni, módosítani, törölni, ill. azokhoz hozzávalókat hozzáadni, mdosítani, törölni
		- operátor('operator'): a normál felhasználó szerepkörén túl bármely felhasználó receptjét kezelheti, továbbá láthatja a felhasználók adatait, vmint törölhet is felhasználókat
	2. Használati eset diagramok
		![Használati eset diagram](docs/images/usecase.jpg)
	3. Folyamatok pontos menete
		![Folyamat pontos menete](docs/images/folyamat.jpg)


## Tervezés

1. Architektúra terv
	1. Komponensdiagram
	2. Oldaltérkép
		![Oldaltérkép](docs/images/oldalterkep.jpg)
	3. Végpontok
		- Nyitólap: `/`
		- Bejelentkezés: `/login`
		- Regisztráció: `/login/signup`
		- Kijelentkezés: `/logout`
		- Receptek listázása: `/recipes/list`
		- Recept megjelenítése: `/recipes/describe/:id`
		- Hozzávaló hozzáadása: `/ingredients/new?id=:id`
		- Hozzávaló módosítása: `/ingredients/modify/:id`
		- Hozzávaló törlése: `/ingredients/delete/:id`
		- Recept módosítása: `/recipes/modify/:id`
		- Recept törlése: `/recipes/delete/:id`
		- Új recept felvétele: `/recipes/new`
		- Operátori felület: `/operator`
		- Felhasználó törlése: `/operator/delete/:id`
2. Felhasználóifelület-modell
	1. Oldalvázlatok
		![Oldalvázlatok](docs/images/oldalterv_op.jpg)
3. Osztálymodell
	1. Adatmodell
		![Adatmodell](docs/images/adatmodell.jpg)
	2. Adatbázisterv
		![Adatbázisterv](docs/images/adatbterv.jpg)
	3. Állapotdiagram
		![Állapotdiagram](docs/images/allapotdiagram.jpg)


## Implementáció

1. Fejlesztői környezet bemutatása
	- A fejlesztéshez a Cloud9 webes felületét használtam, amely egy virtuális linux-alapú felületet biztosít annak minden hasznos eszközével (bash, fájlböngésző, színkiemeléses szövegszerkesztő), szerver tesztelésére saját ideiglenes domaint kínál, valamint fájlok feltöltésére  is lehetőséget ad. Többféle programozási nyelvet is támogat.
2. Könyvtárstruktúrában lévő mappák funkiójának bemutatása
	-A forrásfájlokat a következők szerint csoportosítottam
		- Model - View (itt: handlebars) - Controller - struktúra (`models/ - views/ - controllers/`)
		- `public/` könyvtár: statikus segédelemek (jelen esetben: Bootswatch css)
		- `config/` könyvtár: waterline tárolási beállítások
		- `test/` könyvtár: tesztelő szkriptek
		- `node_modules` könyvtár: node.js segédmodulok


##Tesztelés

1. Tesztelési környezet bemutatása
	A teszteléhez mocha keretrendszert használtam(parancs: `mocha <tesztfájlnév> --timeout 12000`). A maximális késleltetést 15 másodpercre állítottam(`--timeout 12000`) a cloud9 szerver autentikáció terén tapasztalt lassúsága miatt.
2. Egységtesztek
	Az egységek (entity) közül a user-t teszteltem le a chai ellenőrzőkönyvtár segtségével mocha keretrendszerben. A kapcsolódó tesztfájl: `test/test1_usermodel.js`.
3. Funkcionális felületi tesztek
	Funkcionális felületi tesztek elvégzéséhez a zombie.js kereteit használtam. A kapcsolódó tesztfájl: `test/test2_zombie.js`
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
	A futtatáshoz minimum 2GHz-es egymagos processzor, legalább 512 MB RAM és 1GB szabad tárhely ajánlott. A program használatához valamilyen Linux operációs rendszer disztribúció szükséges.
2. Telepítés lépései és a program használata
	A fájlokat a GitHub `Download Zip` opciója segítségével lehet letölteni ezután a saját szerverre kicsomagolással felrakható, majd a server.js futtatásával elindítható. Az esetleges függőségeket (dependency) a `npm install <fuggoseg> --save` paranccsal telepíthetjük.
