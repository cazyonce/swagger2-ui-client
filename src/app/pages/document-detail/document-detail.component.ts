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
  documentParameterOrder = ["path", "query", "body"];
  documentParameterDetail: {
    path?: Array<ParameterEntity>,
    query?: Array<ParameterEntity>,
    body?: Array<ParameterEntity>,
  } = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.currentURLProtocol = window.location.protocol;
    this.currentURLHost = window.location.host;
  }

  ngOnInit() {
    if (!this.documentDetail.detail.parameters) {
      return;
    }
    for (const parameter of this.documentDetail.detail.parameters) {
      var p = this.documentParameterDetail[parameter.in];
      if (!p) {
        this.documentParameterDetail[parameter.in] = p = new Array<ParameterEntity>();
      }
      p.push(parameter);

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
      // console.log(parameter)
    }
    console.log(this.documentParameterDetail.body)
    // console.log(this.documentDetail.detail.parameters)
    // console.log("============1=========")
    // this.documentDetail.detail.parameters = this.documentDetail.detail.parameters.sort((_, p2) => {
    //   return p2.in === "body" || p2.in === "query" ? -1 : 1;
    // })
    // console.log("============2=========")
    // console.log(this.documentDetail.detail.parameters)
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
        // } else if (propertie.items != undefined && propertie.items.$ref != undefined) { // 这是个数组
        //   // 找到属性对应的数据模型并为当前属性生成开始和结束的符号
        //   propertie.expandKey = parentExpandKey ? parentExpandKey + "/" + key : schemaRef + "/" + key;
        //   this.generateExpandSymbolOfPropertie(propertie, propertie.definition = this.processSchemaRefDefinition(propertie.items.$ref, propertie.expandKey));
        //   this.processPropertieArraySchemaRefDefinition(schemaRef, parentExpandKey, key, propertie)

      } else if (propertie.items != undefined) { // 这是个数组
        // 找到属性对应的数据模型并为当前属性生成开始和结束的符号
        // propertie.expandKey = parentExpandKey ? parentExpandKey + "/" + key : schemaRef + "/" + key;
        // this.generateExpandSymbolOfPropertie(propertie, propertie.definition = this.processSchemaRefDefinition(propertie.items.$ref, propertie.expandKey));
        this.processPropertieArraySchemaRefDefinition(propertie, schemaRef, parentExpandKey, key, propertie)

      } else if (propertie.additionalProperties) {
        propertie.expandKey = parentExpandKey ? parentExpandKey + "/" + key : schemaRef + "/" + key;
        if (propertie.additionalProperties.$ref) {
          propertie.definition = this.processSchemaRefDefinition(propertie.additionalProperties.$ref, propertie.expandKey);
        }
        this.generateExpandSymbolOfPropertie(propertie, propertie.definition);
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

  processPropertieArraySchemaRefDefinition(firstPropertie: PropertieEntity, schemaRef: string, parentExpandKey: string, propertieKey: string, propertie: any) {

    if (propertie.items.$ref != undefined) {
      // 找到属性对应的数据模型并为当前属性生成开始和结束的符号
      firstPropertie.expandKey = parentExpandKey ? parentExpandKey + "/" + propertieKey : schemaRef + "/" + propertieKey;
      this.generateExpandSymbolOfPropertie(propertie, firstPropertie.definition = this.processSchemaRefDefinition(propertie.items.$ref, propertie.expandKey));
      firstPropertie.customType = firstPropertie.customType ? firstPropertie.customType + propertie.type + "<" : propertie.type + "<";
      firstPropertie.customType = firstPropertie.customType + firstPropertie.definition.type + ">";
      if (firstPropertie != propertie) {
        firstPropertie.leftSymbol += propertie.leftSymbol;
        firstPropertie.rightSymbol = propertie.rightSymbol + firstPropertie.rightSymbol;
      }
      return;
    } else if (propertie.items.items) {
      this.generateExpandSymbolOfPropertie(propertie);
      firstPropertie.customType = firstPropertie.customType ? firstPropertie.customType + propertie.type + "<" : propertie.type + "<";
      if (firstPropertie != propertie) {
        firstPropertie.leftSymbol += propertie.leftSymbol;
        firstPropertie.rightSymbol = propertie.rightSymbol + firstPropertie.rightSymbol;
      }
      this.processPropertieArraySchemaRefDefinition(firstPropertie, schemaRef, parentExpandKey, propertieKey, propertie.items);
      firstPropertie.customType = firstPropertie.customType + ">";
    } else {
      firstPropertie.customType = propertie.type + "<" + propertie.items.type + ">";
    }
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

  generateExpandSymbolOfPropertie(propertie: PropertieEntity, definition?: SchemaDefinintionEntity) {
    // if (definition.type) {
    //   if (definition.type === "array") {
    //     propertie.leftSymbol += "[";
    //     propertie.rightSymbol = "[" + propertie.rightSymbol;
    //   } else if (definition.type === "object") {
    //     propertie.leftSymbol += "{";
    //     propertie.rightSymbol = "{" + propertie.rightSymbol;
    //   }
    // }
    var object = false;
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
        object = true;
        if (propertie.leftSymbol) {
          propertie.leftSymbol += "{";
          propertie.rightSymbol = "}" + propertie.rightSymbol;
        } else {
          propertie.leftSymbol = "{";
          propertie.rightSymbol = "}";
        }
      }
    }
    if (definition && definition.type) {
      if (definition.type === "array") {
        if (propertie.leftSymbol) {
          propertie.leftSymbol += "[";
          propertie.rightSymbol = "]" + propertie.rightSymbol;
        } else {
          propertie.leftSymbol = "[";
          propertie.rightSymbol = "]";
        }

      } else if (!object && definition.type === "object") {
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
        return JSON.parse(JSON.stringify(definitions[key]));
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
    if (propertie.customType) {
      return propertie.customType
    }
    if (propertieDefinition && propertieDefinition.type) {
      return propertieDefinition.type;
    }
    return propertie.format ? propertie.format : propertie.type;
  }
  processPropertieValue2(propertie: PropertieEntity, propertieDefinition: SchemaDefinintionEntity): string {
    var type = propertie.format ? propertie.format : propertie.type;
    if (type !== "object" && propertieDefinition && propertieDefinition.type) {
      if (type) {
        return type + "<" + propertieDefinition.type + ">";
      }
      return propertieDefinition.type;
    }
    if (propertie.items && propertie.items.type) {
      return type + "<" + propertie.items.type + ">";
    }
    return type;
  }
}
