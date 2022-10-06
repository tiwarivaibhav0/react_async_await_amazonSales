import { Button, Card, Link, Select, TextField } from "@shopify/polaris";
import React, { useContext, useState } from "react";
import { Contxt } from "./CategorySelector";

function AttributeSelector() {
  const [attributeOptions, showAttributeOptions] = useState(false);
  const [selectedAttributeArray, setselectedAttributeArray] = useState([]);
  const [textInputArray, setTextInputArray] = useState([]);
  const [attributeOptionsArray] = useContext(Contxt);
  console.log(attributeOptionsArray);

  const attributeChangeHandler = (e) => {
    // alert(e);
    selectedAttributeArray.push([{ label: e, value: e }]);
    setselectedAttributeArray([...selectedAttributeArray]);
    showAttributeOptions(false);
    attributeOptionsArray.map((it, i) => {
      if (it.value === e) {
        it["disabled"] = true;
      }
      return 0;
    });
  };
  const deleteHandler = (e, i, val) => {
    e.preventDefault();
    selectedAttributeArray.splice(i, 1);
    setselectedAttributeArray([...selectedAttributeArray]);
    textInputArray.splice(i, 1);
    setTextInputArray([...textInputArray]);
    attributeOptionsArray.map((it, j) => {
      if (it.label === val) {
        it["disabled"] = false;
      }
      return 0;
    });
  };
  const inputHandler = (e, i) => {
    textInputArray[i] = e;
    setTextInputArray([...textInputArray]);
  };
  return (
    <div>
      {selectedAttributeArray.length > 0 && (
        <Card sectioned>
          {selectedAttributeArray.map((it, i) => (
            <Card sectioned key={it[0]}>
              {" "}
              <Link
                url="#"
                onClick={(e) => deleteHandler(e, i, it[0]["label"])}
              >
                Delete
              </Link>
              <Select options={it} label="Amazon Attribute" />
              <br />
              <TextField
                placeholder="shopify_attribute"
                onChange={(e) => inputHandler(e, i)}
                value={textInputArray[i]}
              />
            </Card>
          ))}
        </Card>
      )}

      {attributeOptions && (
        <Card title="Amazon attributes">
          <Select
            options={attributeOptionsArray}
            onChange={(e) => attributeChangeHandler(e)}
            placeholder="Select an Attribute"
          />
        </Card>
      )}
      {attributeOptionsArray.length > 0 && (
        <Card title="Optional Attributes" sectioned>
          <Button
            primary
            onClick={() => showAttributeOptions(true)}
            disabled={attributeOptions}
          >
            Add Attributes
          </Button>
        </Card>
      )}
    </div>
  );
}

export default AttributeSelector;
