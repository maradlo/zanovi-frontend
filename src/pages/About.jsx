import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"O"} text2={"NÁS"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            V spoločnosti <b>ZANOVI </b> vám s nadšením prinášame najnovšie a
            najlepšie technológie. Náš obchod bol založený s víziou vytvoriť
            bezproblémový nákupný zážitok a ponúka starostlivo vybraný sortiment
            špičkovej elektroniky od špičkových značiek až po inovatívne
            novinky. Či už ste technologický nadšenec, alebo jednoducho hľadáte
            spoľahlivé produkty, snažíme sa poskytovať rozmanitý sortiment
            vysokokvalitných položiek, ktoré spĺňajú vaše potreby a prekonávajú
            vaše očakávania.
          </p>
          <p>
            Náš záväzok k dokonalosti presahuje rámec našej ponuky produktov.
            Veríme v budovanie trvalých vzťahov s našimi zákazníkmi, a preto je
            našou prioritou výnimočný servis, a to od chvíle, keď si prezriete
            našu stránku, až po chvíľu, keď vám výrobok príde domov. So
            zameraním na inovácie, kvalitu a spokojnosť zákazníkov je{" "}
            <b>ZANOVI </b>
            viac ako len obchod s elektronikou - sme vaším dôveryhodným
            partnerom pri orientácii v rýchlo sa meniacom svete technológií.
          </p>
          <b className="text-gray-800">Naše poslanie</b>
          <p>
            Naším poslaním v spoločnosti <b>ZANOVI </b> je poskytovať našim
            zákazníkom tie najlepšie technológie. Naším cieľom je poskytovať
            prístup k najnovším inováciám a zabezpečiť, aby si každý mohol
            užívať výhody modernej elektroniky. Ponukou produktov najvyššej
            kvality, bezkonkurenčných služieb a konkurencieschopných cien sa
            snažíme byť vašou cieľovou stanicou pre všetky technické veci a
            sprístupniť najmodernejšie technológie každému.
          </p>
        </div>
      </div>

      <div className=" text-xl py-4">
        <Title text1={"PREČO"} text2={"SI NÁS VYBRAŤ"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Zabezpečenie kvality:</b>
          <p className=" text-gray-600">
            Každý výrobok starostlivo vyberáme a preverujeme, aby sme sa
            uistili, že spĺňa naše prísne normy kvality.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Pohodlie:</b>
          <p className=" text-gray-600">
            Vďaka nášmu používateľsky prívetivému rozhraniu a bezproblémovému
            procesu objednávania, nebolo nakupovanie nikdy jednoduchšie.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Výnimočný zákaznícky servis:</b>
          <p className=" text-gray-600">
            Náš tím špecializovaných odborníkov je tu, aby vám pomohol, aby bola
            vaša spokojnosť našou najvyššou prioritou.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
