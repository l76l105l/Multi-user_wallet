import { Component, input, computed } from "@angular/core";
import { OperationInterface } from "../../interfaces/operation-interface";

@Component({
    selector: 'filtered-operations',
    template: `
    @if(filteredOPerations().length>0){
        <table class="customized-table w-full">
        <thead>
            <tr>
                <th  class="rounded-tl-2xl"></th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th  class="rounded-tr-2xl"></th>
            </tr>
        </thead>
        <tbody>
            @for(operation of filteredOPerations(); track $index){
                <tr>
                    <td>{{$index+1}}</td>
                    <td>{{operation.from}}</td>
                    <td>{{operation.to}}</td>
                    <td>{{operation.amount}}</td>
                    <td>{{operation.dateTime}}</td>
                    <td><img class="w-8 h-8 mx-auto" src="trash.svg" alt=""></td>
                </tr>
            }
        </tbody>
    </table>
    }@else {
        <p class="text-[var(--text-page-content)] text-2xl text-center font-bold">No matching operations :/</p>
    }
    `,
})
export class FilteredOperations{
    operations=input.required<OperationInterface[]>();
    login=input<string>();
    from=input<number>();
    to=input<number>();

    filteredOPerations = computed<OperationInterface[]>(() => 
        this.operations().filter((operation)=>{
            let n=this.login();
            let f=this.from();
            let t=this.to();
            if(!n) n='';
            if(!f) f=0;
            if(!t) t= Math.max(...this.operations().map(operation=>operation.amount));
            return (operation.from.includes(n) || operation.to.includes(n)) && (operation.amount>=f && operation.amount<=t)
        })
    )
}