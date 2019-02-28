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
              <div class="display-1">Cashier</div>
              <div class="body-1 font-weight-light ">"Well begun is half done." - Aristotle</div>
            </div>
          </v-layout>
          </v-container>
        </v-card>
      </v-responsive>
    </v-layout>
    <v-container grid-list-lg>
      <v-layout row wrap>
         <v-flex xs12 >
            <v-layout row wrap>
               <v-flex xs8>
                  <v-card flat class="transparent" width="100%">
                     <v-toolbar 
                        class="red lighten-3" flat 
                     >
                        <v-toolbar-title class="white--text"> Transactions</v-toolbar-title>
                        <v-spacer></v-spacer>
                     </v-toolbar>
                     <!-- {{purchaseItem}} -->

                     <v-flex
                        v-if="purchaseItem.length > 0"
                        xs12
                        >
                        <v-data-table
                           :headers="headers2"
                           :items="purchaseItem"
                           class="elevation-1"
                        >
                           <template slot="items" slot-scope="props">
                           <td>{{ props.item.serial }}</td>
                           <td>{{ props.item.model }}</td>
                           <td>{{ props.item.quantity }}</td>
                           <td >{{ props.item.totalPrice }}</td>
                           <td >
                              <v-icon
                                 small
                                 class="mr-2"
                                 @click="editPurchase(props.item)"
                              >
                                 edit
                              </v-icon>
                              <v-icon
                                 small
                                 @click="deletePurchase(props.item)"
                              >
                                 delete
                              </v-icon>
                           </td>
                           </template>
                           
                        </v-data-table>
                        <!-- <v-card>
                           <v-divider></v-divider>
                           <v-list  v-for="(item, index) in purchaseItem" :key="index" dense>
                              <v-list-tile>
                                 <v-list-tile-content>{{item.serial}}</v-list-tile-content>
                                 <v-list-tile-content class="align-end">{{item.quantity}}</v-list-tile-content>
                              </v-list-tile>
                           </v-list>
                        </v-card> -->
                     </v-flex>
                  </v-card>
               </v-flex>

               <v-flex xs4>
                  <v-card flat  class="transparent px-3" width="100%">
                     <v-toolbar 
                        class="red lighten-3" flat 
                     >
                        <v-toolbar-title class="white--text"> Total: {{overAll}} </v-toolbar-title>
                        <v-spacer></v-spacer>
                     </v-toolbar>
                        <v-layout row wrap>
                           <!-- <v-flex xs12>
                              <v-text-field
                                 readonly=""
                                 color="teal"
                                 solo
                                 reverse
                                 :value="overAll"
                                 label="Total"
                              ></v-text-field>
                           </v-flex> -->
                           <v-flex xs5>
                              <v-text-field
                                 color="teal"
                                 label="Name"
                                 v-model="reciept.name"
                                 @input="$v.reciept.name.$touch()" @blur="$v.reciept.name.$touch()" 
                                 :error-messages="nameErrors" required>
                              ></v-text-field>
                           </v-flex>
                           <v-flex xs7>
                              <v-text-field
                                 color="teal"
                                 label="Address"
                                 v-model="reciept.address"
                                 @input="$v.reciept.address.$touch()" @blur="$v.reciept.address.$touch()" 
                                 :error-messages="addressErrors" required>
                              ></v-text-field>
                           </v-flex>
                           <v-flex xs12>
                              <v-text-field
                                 color="teal"
                                 label="Cash"
                                 v-model="reciept.cash"
                                 @input="$v.reciept.cash.$touch()" @blur="$v.reciept.cash.$touch()" 
                                 :error-messages="cashErrors" required
                                 mask="#############">
                              ></v-text-field>
                           </v-flex>
                           <v-flex  xs12>
                              <v-text-field
                                 box
                                 readonly=""
                                 background-color="grey lighten-3"
                                 reverse
                                 color="teal"
                                 :value="changeChange"
                                 mask="#############"
                                 label="Change"
                              ></v-text-field>
                           </v-flex>
                           <v-flex  xs5>
                              <v-btn @click="cancelTrans" block class="white--text" color="red lighten-3">Cancel</v-btn>
                           </v-flex>
                           <v-flex xs7>
                              <v-btn block @click="completeTrans" class="white--text" color="teal lighten-3">Complete</v-btn>
                           </v-flex>
                        
                        </v-layout>
                  </v-card>
               </v-flex>
            </v-layout>


         </v-flex>
         <v-flex xs12>

            <v-flex xs12>
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
                  <td>
                     <v-layout row wrap>
                        <v-btn v-if="props.item.stock > 0" @click="purchase(props.item)" small outline class="text-xs-left caption textNone" color="success">Add</v-btn>
                        <v-btn v-else disabled="" small outline class="text-xs-left caption textNone" color="success">Out of stock</v-btn>
                     </v-layout>
                  </td>
                 
                  </template>
                  <div slot="no-results" :value="true">
                  <v-layout align-center="">
                     <v-icon color="error">mdi-alert</v-icon>
                     <span class="error--text ml-2">Your search for "{{ search }}" found no results.</span>
                  </v-layout>
                  </div>
               </v-data-table>
            </v-flex>
           
         </v-flex>

        

      </v-layout>
    </v-container>

      <v-dialog
         v-model="purchaseDialog"
         width="300"
      >
         <v-card>
         <v-card-title class="grey lighten-3">
            <h3 class="title text-capitalize">Serial #: {{editedItem.serial}} <span class="body-2 success--text"> (₱{{ editedItem.price}})</span></h3>
         </v-card-title>
         <v-divider></v-divider>
         <v-card-text>
            <v-text-field
               color="teal"
               mask="#######"
               v-model="itemsSerial.quantity"
               :label="`${editedItem.model}  Quantity`"
            ></v-text-field>
         </v-card-text>
         <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
               flat
               @click="purchaseDialog = false"
            >
               Cancel
            </v-btn>
            <v-btn
               v-if="editTran"
               color="teal"
               flat
               @click="submitEdit"
               mask="########"
            >
               Update
            </v-btn>
            <v-btn
               v-if="!editTran"
               color="teal"
               flat
               @click="submitPurchase"
               mask="########"
            >
               Submit
            </v-btn>
         </v-card-actions>
         </v-card>
      </v-dialog>

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
  import moment from 'moment'
  import { validationMixin } from 'vuelidate'
   import { required, email} from 'vuelidate/lib/validators'

   export default {
   mixins: [validationMixin],
   validations: { 
      reciept: {
         name: {required},
         address: {required},
         cash: {required}, 
      },
   },
    data () {
      return {
         saveData: [],
         reciept: {
            name: '',
            address: '',
            cash:'', 
            change: '',
         },
         editTran: false,
         purchaseItem: [],
         itemsSerial: {
            quantity: 1,
            serial: '',
            totalPrice: '',
            category: '',
            model: '',
            description:'',
            stock:'',
            price:'',
            keyIndex:'',
         },
        purchaseDialog: false,
        search: '',
        headers: [
          { text: 'Serial #', value: 'serial', sortable: true },
          { text: 'Category', value: 'category' , sortable: true},
          { text: 'Model', value: 'model', sortable: true},
          { text: 'Description', value: 'description', sortable: true},
          { text: 'Stocks', value: 'stock', sortable: true},
          { text: 'Price (₱)', value: 'price', sortable: true},
          { text: 'Action', value: 'price', sortable: true,},
        ],
        headers2: [
          { text: 'Serial #', value: 'serial', sortable: true },
          { text: 'Model', value: 'model', sortable: true},
          { text: 'Quantity', value: 'quantity', sortable: true},
          { text: 'Total Price (₱)', value: 'totalPrice', sortable: true},
          { text: 'Action', value: 'price', sortable: true,},
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
       console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
      this.getCategoryData()
      this.getProductData()
    },
   computed: {
      userFData() {
         return this.$store.getters.userIndex
      },
      nameErrors () {
         const errors = []
         if (!this.$v.reciept.name.$dirty) return errors
         !this.$v.reciept.name.required && errors.push('Name is required')
         return errors
      },
      addressErrors () {
         const errors = []
         if (!this.$v.reciept.address.$dirty) return errors
         !this.$v.reciept.address.required && errors.push('Address is required')
         return errors
      },
      cashErrors () {
         const errors = []
         if (!this.$v.reciept.cash.$dirty) return errors
         !this.$v.reciept.cash.required && errors.push('Cash is required')
         this.overAll > this.reciept.cash && errors.push('Cash is not enough')
         return errors
      },
      changeChange(){
         let value = 0
         if(this.reciept.cash > this.overAll) {
            value = _.subtract(this.reciept.cash,this.overAll)
         }
         return value
      },
      overAll(){
         let total = 0
         _.forEach(this.purchaseItem, function(value, key) {
            total = _.add(value.totalPrice,total)
         })
         return total
      },
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
      },
      productsDa() {
         return this.categorys
      }
    },
    methods: {
       completeTrans() {
         let vm = this
         // ||  vm.overAll < vm.reciept.cash || vm.overAll == 0
         if(vm.$v.reciept.$invalid ) {
            vm.$v.reciept.$touch()
         } else {
            _.forEach(vm.purchaseItem, function(value, key){
               // var newPostKey = firebase.database().ref().child('sales').push().key;
               var updateData = firebase.database().ref().child('Product/'+value.keyIndex);
               updateData.update({
                  stock: _.subtract(value.stock, value.quantity)
               })
            })

            var newPostKey = firebase.database().ref().child('sales').push().key;
            var postdata = firebase.database().ref().child('sales/'+newPostKey);
            console.log(vm.purchaseItem)
               // items: vm.purchaseItem,
            postdata.set({
               incharge: vm.userFData,
               keyIndex: newPostKey,
               test: vm.purchaseItem,
               name: _.capitalize(vm.reciept.name),
               address: _.capitalize(vm.reciept.name),
               cash:  vm.reciept.cash,
               change:  vm.changeChange,
               total:  vm.overAll,
               date: moment().format()
               // date: moment().format('MMMM Do YYYY, h:mm:ss a')
            }, function(error) {
               if(!error){
                  vm.snackbar = true
                  vm.snackbarMessage = 'Successfully transact'
                  vm.$v.reciept.$reset()
                  vm.purchaseItem = []
                  vm.reciept = {
                     name: '',
                     address: '',
                     cash:'', 
                     change: '',
                  }
               }
            })
           
         }
       },
       cancelTrans() {
          let vm = this
          vm.$v.reciept.$reset()
          this.purchaseItem = []
          this.reciept = {
            name: '',
            address: '',
            cash:'', 
            change: '',
          }
       },
       submitEdit(){
          if(this.itemsSerial.quantity != 0 && this.itemsSerial.stock >= this.itemsSerial.quantity) {
            this.purchaseItem.splice(this.purchaseItem.indexOf(this.saveData), 1)
            var data = _.find(this.purchaseItem,['keyIndex',this.itemsSerial.keyIndex])
            this.itemsSerial.totalPrice = _.multiply(this.itemsSerial.price, this.itemsSerial.quantity);
            this.purchaseItem.push(this.itemsSerial)
            this.purchaseDialog = false
          } else {

          }
       },
       editPurchase(data) {
          this.saveData = data
          this.editTran= true
         this.purchaseDialog = true
         this.itemsSerial = {
            quantity: data.quantity,
            serial: data.serial,
            category: data.category,
            model: data.model,
            description: data.description,
            stock: data.stock,
            price: data.price,
            keyIndex: data.keyIndex,
         }
            this.editedItem = {
            serial: data.serial,
            serialDummy: data.serialDummy,
            category: data.category,
            model: data.model,
            description: data.description,
            stock: data.stock,
            price: data.price,
            keyIndex: data.keyIndex,
         }
       },
       deletePurchase(data) {
         this.purchaseItem.splice(this.purchaseItem.indexOf(data), 1)
       },
      submitPurchase() {
          if(this.itemsSerial.quantity != 0 && this.itemsSerial.stock >= this.itemsSerial.quantity) {
            var data = _.find(this.purchaseItem,['keyIndex',this.itemsSerial.keyIndex])
            if(data) {

            } else {
               this.itemsSerial.totalPrice = _.multiply(this.itemsSerial.price, this.itemsSerial.quantity);
               this.purchaseItem.push(this.itemsSerial)
               this.purchaseDialog = false
            }
         }

      },
      purchase(data) {
          this.editTran= false
         this.purchaseDialog = true
         this.itemsSerial = {
            quantity: data.quantity,
            serial: data.serial,
            category: data.category,
            model: data.model,
            description: data.description,
            stock: data.stock,
            price: data.price,
            keyIndex: data.keyIndex,
         }
         this.editedItem = {
            serial: data.serial,
            serialDummy: data.serialDummy,
            category: data.category,
            model: data.model,
            description: data.description,
            stock: data.stock,
            price: data.price,
            keyIndex: data.keyIndex,
        }
      },
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
        var pushCategory = categoryRef.ref('Product').push()
        pushCategory.set({
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
        updateCategory.set({
          serial: vm.editedItem.serial,
          category: _.capitalize(vm.editedItem.category),
          model: _.capitalize(vm.editedItem.model),
          description:  _.capitalize(vm.editedItem.serial),
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
