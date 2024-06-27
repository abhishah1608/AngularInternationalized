import { Pipe, PipeTransform } from "@angular/core";
import { Translator } from "../model/transalator";
import { Message } from "../model/message";

@Pipe({
  name: "languageTranslator",
})
export class LanguageTranslatorPipe implements PipeTransform {
  obj: Translator[];

  messagelist: Message[];

  transform(source: string, language: string, translatorSource: any): string {
    let retval: string = null;
    this.obj = translatorSource as Translator[];
    if (this.obj && this.obj.length > 0) {
      this.obj.forEach((element) => {
        if (element.source.toLowerCase() === source.toLowerCase()) {
          this.messagelist = element.messages;
          retval = source;
          if (this.messagelist && this.messagelist.length > 0) {
            // tslint:disable-next-line:no-shadowed-variable
            this.messagelist.forEach((Message) => {
              if (Message.key === language) {
                retval = Message.message;
                return retval;
              }
            });
          }
        }
      });
    }
    return retval;
  }
}
