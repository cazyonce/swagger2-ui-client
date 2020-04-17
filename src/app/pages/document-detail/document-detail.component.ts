import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DocumentDetailEntity } from 'src/app/entity/document-detail.entity';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SchemaDefinintionEntity } from 'src/app/entity/schema-definition.entity';
import { PropertieEntity } from 'src/app/entity/propertie.entity';
import { ParameterEntity } from 'src/app/entity/parameter.entity';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, AfterViewInit {

  @Input() documentDetail: DocumentDetailEntity;
  mapOfExpandData: { [key: string]: boolean } = {};
  currentURLProtocol: string;
  currentURLHost: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.currentURLProtocol = window.location.protocol;
    this.currentURLHost = window.location.host;
  }

  ngOnInit() {
    for (const parameter of this.documentDetail.detail.parameters) {
      parameter.hiddenName = parameter.in === "body";

      // 若该参数以下条件成立，表示数据是一个引用对象
      if (parameter.schema && parameter.schema.$ref) {
        // 找到对应的引用对象
        // let definition = parameter.definition = this.getDefinitionBySchemaRef(parameter.schema.$ref);
        // let definition = parameter.definition = this.processSchemaRefDefinition(parameter.schema.$ref);
        // 为当前参数生成开始和结束的符号
        parameter.expandKey = parameter.schema.$ref + "/" + parameter.name
        this.generateExpandSymbolOfParameter(parameter, parameter.definition = this.processSchemaRefDefinition(parameter.schema.$ref, parameter.expandKey));
        // this.processSchemaRefDefinition(parameter.schema.$ref);
        // 
        // for (const key in definition.properties) {

        //   let propertie = definition.properties[key];
        //   if (propertie['$ref'] != undefined) {
        //     let definition2 = propertie.definition = this.getDefinitionBySchemaRef(propertie.$ref);
        //     this.generateExpandSymbolOfPropertie(propertie, definition2);

        //   }
        // }
        // // 存在必填属性数组，将必填标识添加到对应的属性上
        // if (definition.required) {
        //   for (const propertieName of definition.required) {
        //     definition.properties[propertieName]["required"] = true;
        //   }
        // }
      }
      console.log(parameter)
    }
  }

  processSchemaRefDefinition(schemaRef: string, parentExpandKey: string): SchemaDefinintionEntity {
    // 找到对应的引用对象
    let definition = this.getDefinitionBySchemaRef(schemaRef);
    if (!definition) {
      return null;
    }

    for (const key in definition.properties) {

      let propertie = definition.properties[key];
      // 若当前属性值存在引用链接，表示值是一个对象或数组
      if (propertie.$ref != undefined) {
        // 找到属性对应的数据模型并为当前属性生成开始和结束的符号
        propertie.expandKey = parentExpandKey ? parentExpandKey + "/" + key : schemaRef + "/" + key;
        this.generateExpandSymbolOfPropertie(propertie, propertie.definition = this.processSchemaRefDefinition(propertie.$ref, propertie.expandKey));
      } else if (propertie.items != undefined && propertie.items.$ref != undefined) { // 这是个数组
        // 找到属性对应的数据模型并为当前属性生成开始和结束的符号
        propertie.expandKey = parentExpandKey ? parentExpandKey + "/" + key : schemaRef + "/" + key;
        this.generateExpandSymbolOfPropertie(propertie, propertie.definition = this.processSchemaRefDefinition(propertie.items.$ref, propertie.expandKey));
      }
    }
    // 存在必填属性数组，将必填标识添加到对应的属性上
    if (definition.required) {
      for (const propertieName of definition.required) {
        definition.properties[propertieName]["required"] = true;
      }
    }
    return definition;
  }

  generateExpandSymbolOfParameter(parameter: ParameterEntity, definition: SchemaDefinintionEntity) {
    if (definition.type) {
      if (definition.type === "array") {
        if (parameter.leftSymbol) {
          parameter.leftSymbol += "[";
          parameter.rightSymbol = "]" + parameter.rightSymbol;
        } else {
          parameter.leftSymbol = "[";
          parameter.rightSymbol = "]";
        }

      } else if (definition.type === "object") {
        if (parameter.leftSymbol) {
          parameter.leftSymbol += "{" + parameter.leftSymbol;
          parameter.rightSymbol = "}" + parameter.rightSymbol;
        } else {
          parameter.leftSymbol = "{";
          parameter.rightSymbol = "}";
        }
      }
    }
  }

  generateExpandSymbolOfPropertie(propertie: PropertieEntity, definition: SchemaDefinintionEntity) {
    // if (definition.type) {
    //   if (definition.type === "array") {
    //     propertie.leftSymbol += "[";
    //     propertie.rightSymbol = "[" + propertie.rightSymbol;
    //   } else if (definition.type === "object") {
    //     propertie.leftSymbol += "{";
    //     propertie.rightSymbol = "{" + propertie.rightSymbol;
    //   }
    // }
    // 属性存在类型
    if (propertie.type) {
      if (propertie.type === "array") {
        if (propertie.leftSymbol) {
          propertie.leftSymbol += "[";
          propertie.rightSymbol = "]" + propertie.rightSymbol;
        } else {
          propertie.leftSymbol = "[";
          propertie.rightSymbol = "]";
        }
      } else if (propertie.type === "object") {
        if (propertie.leftSymbol) {
          propertie.leftSymbol += "{";
          propertie.rightSymbol = "}" + propertie.rightSymbol;
        } else {
          propertie.leftSymbol = "{";
          propertie.rightSymbol = "}";
        }
      }
    }
    if (definition.type) {
      if (definition.type === "array") {
        if (propertie.leftSymbol) {
          propertie.leftSymbol += "[";
          propertie.rightSymbol = "]" + propertie.rightSymbol;
        } else {
          propertie.leftSymbol = "[";
          propertie.rightSymbol = "]";
        }

      } else if (definition.type === "object") {
        if (propertie.leftSymbol) {
          propertie.leftSymbol += "{";
          propertie.rightSymbol = "}" + propertie.rightSymbol;
        } else {
          propertie.leftSymbol = "{";
          propertie.rightSymbol = "}";
        }
      }
    }
  }

  getDefinitionBySchemaRef(schemaRef: string): SchemaDefinintionEntity {
    const definitions = this.documentDetail.doc.definitions;
    for (const key in definitions) {
      if (schemaRef == '#/definitions/' + key) {
        return definitions[key];
      }
    }
    return null; // 这个数据正常的情况下是不会执行到该位置的
  }

  ngAfterViewInit() {
    const fragment = this.activatedRoute.snapshot.fragment;
    if (fragment) {
      this.goTo(fragment);
    }
  }

  getDefinitionRef(propertie: any): string {
    if (propertie) {

      let ref;
      // 第一个是对象
      if (ref = propertie['$ref']) {
        return ref;
      }
      //  第二个是数组
      if (propertie['items'] && (ref = propertie['items']['$ref'])) {
        return ref;
      }
    }
    return null;
  }
  // 截取数据引用 例:	#/definitions/DataResponse«TokenVO» 截取DataResponse«TokenVO»并返回
  subDefinitionRef(ref: string): string {
    if (ref) {
      let strs = ref.split("/");
      return strs[strs.length - 1];
    }
    return "-";
  }

  goTo(fragment: string): void {
    const element = document.querySelector("#" + fragment)
    if (element) element.scrollIntoView(true)
  }

  processPropertieValue(propertie: PropertieEntity, propertieDefinition: SchemaDefinintionEntity): string {
    var type = propertie.format ? propertie.format : propertie.type;
    if (propertieDefinition && propertieDefinition.type) {
      if (type) {
        return type + "<" + propertieDefinition.type + ">";
      }
      return propertieDefinition.type;
    }
    return type;
  }
}
