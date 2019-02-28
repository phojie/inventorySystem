<template>
  <div>
    <v-layout
      justify-center
      align-center
    >
      <v-responsive
      class="bgright2 white--text"
      height="130"
      > 
        <v-card height="100%" style="background-color:#ffffffcf;">
          <v-container>
          <v-layout row fill-height >
            <div>
              <div class="display-1">Products</div>
              <div class="body-1 font-weight-light ">"Well begun is half done." - Aristotle</div>
            </div>
          </v-layout>
          </v-container>
        </v-card>
      </v-responsive>
    </v-layout>
    <v-container  >
   
    <v-toolbar 
      class="teal lighten-3" flat 
      
    >
      <v-toolbar-title class="teal--text">List of Products</v-toolbar-title>
      <!-- <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider> -->
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        class="jiebtn"
        solo-inverted
        single-line
        dark
        color="teal"
        hide-details
        flat
      ></v-text-field>
      <v-btn depressed @click="newItem" color="white" dark class="textNone caption teal--text mb-2">New Item</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="categoryData"
      class="mt-3 elevation-1 teal"
      :loading="categoryLoadingdata"
      :search="search"
     >
     
      <template v-if="props.item.keyIndex != 'test'" slot="items" slot-scope="props">
        <td  v-if="props.item.stock <= 10 && props.item.stock != 0" class="body-1" ><v-icon color="warning" size="20">mdi-alert-box</v-icon> {{ props.item.serial }} </td>
        <td  v-else-if="props.item.stock == 0" class="body-1" > <v-icon color="error" size="20" >mdi-alert-box</v-icon> {{ props.item.serial }}  </td>
        <td  v-else class="body-1" >{{ props.item.serial }}</td>
        <td>{{ props.item.category }}</td>
        <td>{{ props.item.model }}</td>
        <td>{{ props.item.description }}</td>
        <td v-if="props.item.stock <= 10 && props.item.stock != 0" class="warning--text">{{ props.item.stock }}</td>
        <td  v-else-if="props.item.stock == 0" class="error--text">{{ props.item.stock }}</td>
        <td v-else>{{ props.item.stock }}</td>
        <td>{{ props.item.price }}</td>
        <td class="">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteDialog(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <div slot="no-results" :value="true">
        <v-layout align-center="">
         <v-icon color="error">mdi-alert</v-icon>
         <span class="error--text ml-2">Your search for "{{ search }}" found no results.</span>
        </v-layout>
      </div>
    </v-data-table>
    
    <v-dialog
      persistent
      :value="dialogEdit"
      width="600"
    >
      <v-card>
          <v-card-title>
            <span class="headline"> {{headlineTitle}}  </span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6 >
                  <v-text-field :error-messages="serialMessage" color="teal" ref="serialNumber" v-model="editedItem.serial" label="Serial Number"></v-text-field>
                </v-flex>
                <v-flex xs6 >
                  <v-select
                    :items="selectCategorys"
                    label="Select Category"
                    color="teal" 
                    item-text="cname"
                    item-value="cname"
                    v-model="editedItem.category" 
                  ></v-select>
                </v-flex>
                <v-flex xs6 >
                  <v-text-field  color="teal" v-model="editedItem.model" label="Model"></v-text-field>
                </v-flex>
                <v-flex order-xs6 >
                  <v-text-field color="teal"   v-model="editedItem.description" label="Description"></v-text-field>
                </v-flex>
                 <v-flex xs6 >
                  <v-text-field  color="teal" mask="###############" v-model="editedItem.stock" label="Stock"></v-text-field>
                </v-flex>
                <v-flex order-xs6 >
                  <v-text-field color="teal" mask="###############" v-model="editedItem.price" label="Price"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <!-- <div v-if="serialValidty && ">
              <v-layout align-center="">
              <v-icon color="error">mdi-alert</v-icon>
              <span class="error--text ml-2"> {{editedItem.serial}} is already exist</span>
              </v-layout>
          </div> -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal darken-1" flat @click="cancel">Cancel</v-btn>
            <v-btn v-if="headlineTitle != 'Add Product'" :disabled="saveValid" color="teal darken-1" flat @click="editItemSave(editedItem)">Save</v-btn>
            <v-btn v-else color="teal darken-1"  :disabled="saveValid"  flat @click="addCategoryData">Save</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog
      v-model="deletedialog"
      width="300"
    >
      <v-card>
        <v-card-title>
          <span class="body-2"> Are you sure you want to delete this item?  </span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="deletedialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            flat
            @click="deleteItem"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-container>
    <v-snackbar
      bottom
      right
      color="white"
      v-model="snackbar"
    > 
    <span class="teal--text">{{snackbarMessage}}</span>
    </v-snackbar>
  </div>
</template>

<script>
  import firebase from 'firebase'
  export default {
    data () {
      return {
        search: '',
        headers: [
          { text: 'Serial #', value: 'serial', sortable: true },
          { text: 'Category', value: 'category' , sortable: true},
          { text: 'Model', value: 'model', sortable: true},
          { text: 'Description', value: 'description', sortable: true},
          { text: 'Stocks', value: 'stock', sortable: true},
          { text: 'Price (₱)', value: 'price', sortable: true},
          { text: 'Actions',  value: false,sortable: false},
        ],
        categorys: [],
        categorysSelect: [],
        categoryLength: '',
        categoryLoadingdata: false,
        dialogEdit: false,
        editedItem: {
          serial: '',
          serialDummy: '',
          category: '',
          model: '',
          description:'',
          stock:'',
          price:'',
          keyIndex:'',
        },
        headlineTitle: '',
        snackbar: false,
        snackbarMessage: '',
        deletedialog: false,
        addTotal: {
          filterCate: '',
          filterKey: ''
        },
        addTotal: {
          filterCate: '',
          filterKey: ''
        }
      
      }
    },
    created() {
      this.getCategoryData()
      this.getProductData()
    },
    computed: {
      serialMessage() {
        var droptest = _.dropRight(this.categoryData)
        var findThis = _.find(droptest, ['serial', this.editedItem.serial])
        if(findThis && this.editedItem.serial != this.editedItem.serialDummy) {
          return "Serial number already exist"
        } else {
          return ''
        }
      },
      serialValidty() {
        var droptest = _.dropRight(this.categoryData)
        var findThis = _.find(droptest, ['serial', this.editedItem.serial])
        if(findThis && this.editedItem.serial != this.editedItem.serialDummy) {
          return true
        } else {
          return false
        }
      },
      saveValid() {
        if( this.serialValidty || this.editedItem.price ==  ''|| this.editedItem.serial ==  '' ||this.editedItem.category ==  '' ||this.editedItem.model ==  '' ||this.editedItem.description ==  '' || this.editedItem.stock == '') {
          return true
        }
          return false
      },
      selectCategorys() {
        if(this.categorysSelect.length > 1) {
          return _.dropRight(this.categorysSelect)
          // return _.orderBy(this.categorys, 'order');
        } else {
          return []
        }
      },
      categoryData() {
        if(this.categorys.length > 1) {
          return _.orderBy(this.categorys, 'order');
        } else {
          return []
        }
      }
    },
    methods: {
      getProductData() {
        let vm = this
        vm.categoryLoadingdata = true
        var categoryRef = firebase.database()
        var getCategory = categoryRef.ref('Product');
        getCategory.on('value', function(getData) {
          let keys = Object.keys(getData.val())
          vm.categorys = getData.val();
          keys.forEach( function (key) {
          vm.categorys[key].keyIndex = key
          // console.log(getData.val())
          })
          vm.categorys = _.orderBy(vm.categorys, 'order');
          vm.categoryLoadingdata = false
        })
      },
      getCategoryData() {
        let vm = this
        vm.categoryLoadingdata = true
        var categoryRef = firebase.database()
        var getCategory = categoryRef.ref('Category');
        getCategory.on('value', function(getData) {
          let keys = Object.keys(getData.val())
          vm.categorysSelect = getData.val();
          keys.forEach( function (key) {
          vm.categorysSelect [key].keyIndex = key
          // console.log(getData.val())
          })
          vm.categorysSelect = _.orderBy(vm.categorysSelect, 'order');
          vm.categoryLoadingdata = false
        })
      },
      addCategoryData() {
        let vm = this
        var categoryRef = firebase.database()
        var newPostKey = firebase.database().ref().child('sales').push().key;
        var pushCategory = categoryRef.ref('Product/'+newPostKey)
        pushCategory.set({
           keyIndex: newPostKey,
          serial: vm.editedItem.serial,
          category: _.capitalize(vm.editedItem.category),
          model: _.capitalize(vm.editedItem.model),
          description:  _.capitalize(vm.editedItem.description),
          stock: vm.editedItem.stock,
          price: vm.editedItem.price,
        })

        var getCat = categoryRef.ref('Category')
        getCat.on('value', function(getdata) {
          var findKey = _.findKey(getdata.val(), ['cname', vm.editedItem.category])
          var filter = _.filter(getdata.val(), ['cname', vm.editedItem.category])
          vm.addTotal = { filterCate : filter, filterKey : findKey}
        })
        firebase.database().ref('Category/' + vm.addTotal.filterKey).update({
          total: (vm.addTotal.filterCate[0].total * 1) + 1
        })
        vm.$refs.serialNumber.focus()
        vm.snackbar = true
        vm.snackbarMessage = `Successfully added: SERIAL# ${_.capitalize(vm.editedItem.serial)}`
        vm.editedItem ={ 
          serial: '',
          serialDummy: '',
          category: '',
          categoryDummy:'',
          model: '',
          description:'',
          stock:'',
          price:'',
          keyIndex:''
          }
      },
      newItem() {
        let vm = this
        this.headlineTitle = 'Add Product'
        this.dialogEdit = true
        vm.$refs.serialNumber.focus()
      },
      deleteDialog(item) {
        this.deletedialog = true
        this.editedItem = {
          category: item.category,
          keyIndex: item.keyIndex,
        }
      },
      deleteItem() {
        let vm = this
        var categoryRef = firebase.database()
        categoryRef.ref(`Product/${vm.editedItem.keyIndex}`).remove()
        var getCat = categoryRef.ref('Category')
        getCat.on('value', function(getdata) {
          var findKey = _.findKey(getdata.val(), ['cname', vm.editedItem.category])
          var filter = _.filter(getdata.val(), ['cname', vm.editedItem.category])
          vm.addTotal = { filterCate : filter, filterKey : findKey}
        })
        firebase.database().ref('Category/' + vm.addTotal.filterKey).update({
          total: (vm.addTotal.filterCate[0].total * 1) - 1
        })
        vm.snackbar = true
        vm.snackbarMessage = `Successfully deleted`
        this.deletedialog = false
      },
      editItemSave() {
        let vm = this 
        var categoryRef = firebase.database()
        var updateCategory = categoryRef.ref(`Product/${vm.editedItem.keyIndex}`)
        updateCategory.update({
          serial: vm.editedItem.serial,
          category: _.capitalize(vm.editedItem.category),
          model: _.capitalize(vm.editedItem.model),
          description:  _.capitalize(vm.editedItem.description),
          stock: vm.editedItem.stock,
          price: vm.editedItem.price,
        }, function (error) {
          if(error) {
            alert('something is wrong')
          } else {
          }
        })

        var getCat = categoryRef.ref('Category')
        getCat.on('value', function(getdata) {
          var findKey = _.findKey(getdata.val(), ['cname', vm.editedItem.category])
          var filter = _.filter(getdata.val(), ['cname', vm.editedItem.category])
          vm.addTotal = { filterCate : filter, filterKey : findKey}

          var minfindKey = _.findKey(getdata.val(), ['cname', vm.editedItem.categoryDummy])
          var minfilter = _.filter(getdata.val(), ['cname', vm.editedItem.categoryDummy])
          vm.minTotal = { filterCate : minfilter, filterKey : minfindKey}
        })
        if(vm.addTotal.filterKey == vm.minTotal.filterKey) {
        } else {
           firebase.database().ref('Category/' + vm.minTotal.filterKey).update({
            total: (vm.minTotal.filterCate[0].total * 1) - 1
          })
          firebase.database().ref('Category/' + vm.addTotal.filterKey).update({
            total: (vm.addTotal.filterCate[0].total * 1) + 1
          })
        }
        
        vm.dialogEdit = false
        vm.snackbar = true
        vm.snackbarMessage = `Successfully updated: SERIAL# ${_.capitalize(vm.editedItem.serial)}`
        vm.editedItem ={ 
            serial: '',
            serialDummy: '',
            categoryDummy : '',
            category: '',
            model: '',
            description:'',
            stock:'',
            price:'',
            keyIndex:''
        }
      },
      editItem(item) {
        let vm = this
        vm.$refs.serialNumber.focus()
        this.headlineTitle = 'Edit category'
        this.dialogEdit = true
        this.editedItem = {  
          serial: item.serial,
          serialDummy: item.serial,
          category: item.category,
          categoryDummy : item.category,
          model: item.model,
          description: item.description,
          stock: item.stock,
          price: item.price,
          keyIndex: item.keyIndex
          }
      },
      cancel() {
        this.dialogEdit = false
        this.editedItem ={ 
          serial: '',
          serialDummy: '',
          category: '',
          categoryDummy : '',
          model: '',
          description:'',
          stock:'',
          price:'',
          keyIndex:'',
        }
      }
    }
  }
</script>
